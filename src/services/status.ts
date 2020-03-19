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
            const sidoStatus = $("div.maplist").children().not("#mapAll").not("h3").not(".legend");
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
            const totals = $("ul.liveNum span.num");
            const befores = $("ul.liveNum span.before");
            const baseDate: string = $("div.live_left span.livedate").text();

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

    public async getClinicStatus({ lat, lng }: ILocationDTO): Promise<{ baseDate: string, result: IMedicalInstitutionStatus[] }> {
        try {
            const { data } = await axios.get("https://www.mohw.go.kr/react/popup_200128_3.html");
            const $ = cheerio.load(data);
            const manager = getManager();

            const baseDate: string = $("div.viewtop").text().split("황")[1].trim();
            const clinics = await manager.query(`select *, (6371*acos(cos(radians(${lat}))*cos(radians(lat))*cos(radians(lng)-radians(${lng}))+sin(radians(${lat}))*sin(radians(lat)))) as distance from clinic having distance <= 1 order by distance;`);
            const result: IMedicalInstitutionStatus[] = [];

            clinics.forEach((clinic: IMedicalInstitutionStatus) => {
                const { name, address, phone, lat, lng }: IMedicalInstitutionStatus = clinic;
                result.push({ name, address, phone, lat, lng });
            });

            return { baseDate, result };
        } catch (err) {
            throw err;
        }
    };

    public async getHospitalStatus({ lat, lng }: ILocationDTO): Promise<{ baseDate: string, result: IMedicalInstitutionStatus[] }> {
        try {
            const { data } = await axios.get("https://www.mohw.go.kr/react/popup_200128.html");
            const $ = cheerio.load(data);
            const manager = getManager();

            const baseDate: string = $("div.viewtop").text().split("황")[1].trim();
            const hospitals = await manager.query(`select *, (6371*acos(cos(radians(${lat}))*cos(radians(lat))*cos(radians(lng)-radians(${lng}))+sin(radians(${lat}))*sin(radians(lat)))) as distance from hospital having distance <= 1 order by distance;`);
            const result: IMedicalInstitutionStatus[] = [];

            hospitals.forEach((hospital: IMedicalInstitutionStatus) => {
                const { name, address, phone, lat, lng }: IMedicalInstitutionStatus = hospital;
                result.push({ name, address, phone, lat, lng });
            });

            return { baseDate, result };
        } catch (err) {
            throw err;
        }
    };
};