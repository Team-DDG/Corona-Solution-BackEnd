import axios from "axios";
import * as cheerio from "cheerio";
import { Service } from "typedi";
import { IPersonStatus, ISidoStatus, IPatientStatus, IHospitalStatus } from "../interfaces/IStatus";
import { ILocationDTO } from "../interfaces/ILocation";
import { InjectManager } from "typeorm-typedi-extensions";

@Service()
export default class StatusService {
    constructor(
        @InjectManager() private entityManager: Typeorm.Manager
    ) { }

    public async getSidoStatus(): Promise<{ baseDate: string, result: ISidoStatus[] }> {
        try {
            const { data } = await axios.get("http://ncov.mohw.go.kr/");
            const $ = cheerio.load(data);
            const baseDate: string = $("div.live_right span.livedate").text();
            const sidoStatus = $("div.rpsa_detail")
                .children()
                .children()
                .not(".info_map_script")
                .not("h3")
                .not("#mapAll");
            const result: ISidoStatus[] = [];

            sidoStatus.each(function (i, elem) {
                const sido: string = $(this).find(".cityname").text();
                const nums = $(this).find(".cityinfo span.num");
                const confirmed: string = nums.eq(0).text();
                const dead: string = nums.eq(3).text();

                result.push({ sido, confirmed, dead });
            });

            return { baseDate, result };
        } catch (err) {
            throw err;
        }
    };

    public async getPatientStatus(): Promise<{ baseDate: string, result: IPatientStatus }> {
        try {
            const { data } = await axios.get("http://ncov.mohw.go.kr/");
            const $ = cheerio.load(data);
            const totals = $("div.liveNum ul span.num");
            const befores = $("div.liveNum ul span.before");
            const baseDate: string = $("div.liveNumOuter span.livedate").text();
            const personDataArr: IPersonStatus[] = [];

            personDataArr.push({
                total: totals.eq(0).text().split(')')[1],
                before: befores.eq(0).eq(0).text().split('비 ')[1]
            });

            for (let i = 1; i < 4; i++) {
                personDataArr.push({
                    total: totals.eq(i).text(),
                    before: befores.eq(i).eq(0).text()
                });
            }

            const result: IPatientStatus = {
                confirmed: personDataArr[0],
                cured: personDataArr[1],
                curing: personDataArr[2],
                dead: personDataArr[3]
            };

            return { baseDate, result };
        } catch (err) {
            throw err;
        }
    };

    public async getHospitalStatus({ lat, lng }: ILocationDTO, table: 'clinic' | 'hospital'): Promise<{ result: IHospitalStatus[] }> {
        try {
            const infos = await this.entityManager.query(`select *, (6371*acos(cos(radians(${lat}))*cos(radians(lat))*cos(radians(lng)-radians(${lng}))+sin(radians(${lat}))*sin(radians(lat)))) as distance from ${table} having distance <= 3 order by distance;`);
            const result: IHospitalStatus[] = [];

            infos.forEach((info: IHospitalStatus) => {
                const { name, address, phone, lat, lng }: IHospitalStatus = info;
                result.push({ name, address, phone, lat, lng });
            });

            return { result };
        } catch (err) {
            throw err;
        }
    };
};