import axios from "axios";
import * as cheerio from "cheerio";
import { IPersonStatus, ISidoStatus, IPatientStatus, IMedicalInstitutionStatus } from "../interfaces/IStatus";
import { ILocationDTO } from "../interfaces/ILocation";
import { getManager } from "typeorm";

export default class StatusService {
    public async getSidoStatus(): Promise<{ baseDate: string, result: ISidoStatus[] }> {
        try {
            const { data } = await axios.get("http://ncov.mohw.go.kr/");
            const $ = cheerio.load(data);
            const sidoStatus = $("div.rpsa_detail").children().children().not(".info_map_script").not("h3").not("#mapAll").not('#map_city18');
            const baseDate: string = $("div.live_right span.livedate").text();
            const result: ISidoStatus[] = [];

            sidoStatus.each(function (i, elem) {
                const sido: string = $(this).find(".cityname").text();
                const confirmed: string = $(this).find(".cityinfo").children().find("span.num").eq(0).eq(0).text();
                const dead: string = $(this).find(".cityinfo").children().find("span.num").eq(1).eq(0).text();

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

            const confirmed: IPersonStatus = {
                total: totals.eq(0).text().split(')')[1],
                before: befores.eq(0).eq(0).text().split('비 ')[1]
            };
            const cured: IPersonStatus = {
                total: totals.eq(1).text(),
                before: befores.eq(1).eq(0).text()
            };
            const curing: IPersonStatus = {
                total: totals.eq(2).text(),
                before: befores.eq(2).eq(0).text()
            }
            const dead: IPersonStatus = {
                total: totals.eq(3).text(),
                before: befores.eq(3).eq(0).text()
            }
            const result: IPatientStatus = { confirmed, cured, curing, dead };

            return { baseDate, result };
        } catch (err) {
            throw err;
        }
    };

    public async getClinicOrHospitalStatus({ lat, lng }: ILocationDTO, table: 'clinic' | 'hospital'): Promise<{ result: IMedicalInstitutionStatus[] }> {
        try {
            const manager = getManager();
            const infos = await manager.query(`select *, (6371*acos(cos(radians(${lat}))*cos(radians(lat))*cos(radians(lng)-radians(${lng}))+sin(radians(${lat}))*sin(radians(lat)))) as distance from ${table} having distance <= 3 order by distance;`);
            const result: IMedicalInstitutionStatus[] = [];

            infos.forEach((info: IMedicalInstitutionStatus) => {
                const { name, address, phone, lat, lng }: IMedicalInstitutionStatus = info;
                result.push({ name, address, phone, lat, lng });
            });

            return { result };
        } catch (err) {
            throw err;
        }
    };
};