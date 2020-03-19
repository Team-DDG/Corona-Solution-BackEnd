import axios from "axios";
import * as cheerio from "cheerio";
import { IStatus, ISidoStatus, IPatientStatus } from "../interfaces/IStatus";

export default class StatusService {
    public async getSidoStatus(): Promise<{ baseDate: string, status: ISidoStatus[] }> {
        try {
            const { data } = await axios.get("http://ncov.mohw.go.kr/");
            const $ = cheerio.load(data);
            const sidoStatus = $("div.maplist").children().not("#mapAll").not("h3").not(".legend");
            const baseDate: string = $("div.live_right span.livedate").text();
            const status: ISidoStatus[] = [];

            sidoStatus.each(function (i, elem) {
                const sido: string = $(this).find(".cityname").text();
                const confirmed: string = $(this).find(".cityinfo").children().find("span.num").eq(0).eq(0).text();
                const dead: string = $(this).find(".cityinfo").children().find("span.num").eq(1).eq(0).text();
                
                status.push({ sido, confirmed, dead });
            });

            return { baseDate, status };
        } catch (err) {
            throw err;
        }
    };

    public async getPatientStatus(): Promise<IPatientStatus> {
        try {
            const { data } = await axios.get("http://ncov.mohw.go.kr/");
            const $ = cheerio.load(data);
            const totals = $("ul.liveNum span.num");
            const befores = $("ul.liveNum span.before");
            const baseDate: string = $("div.live_left span.livedate").text();
            
            const confirmed: IStatus = {
                total: totals.eq(0).text().split(')')[1],
                before: befores.eq(0).eq(0).text().split('비 ')[1]
            };
            const cured: IStatus = {
                total: totals.eq(1).text(),
                before: befores.eq(1).eq(0).text()
            };
            const curing: IStatus = {
                total: totals.eq(2).text(),
                before: befores.eq(2).eq(0).text()
            }
            const dead: IStatus = {
                total: totals.eq(3).text(),
                before: befores.eq(3).eq(0).text()
            }

            return { baseDate, confirmed, cured, curing, dead };
        } catch (err) {
            throw err;
        }
    };
};