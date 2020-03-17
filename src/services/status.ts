import axios from "axios";
import * as cheerio from "cheerio";
import { IStatus, ISidoStatus, IPatientStatus } from "../interfaces/IStatus";

export default class StatusService {
    public async getSidoStatus(): Promise<{ baseDate: string, status: ISidoStatus[] }> {
        try {
            const { data } = await axios.get("http://ncov.mohw.go.kr/");
            const $ = cheerio.load(data);
            const sidoStatus = $("div.maplist").children().not("#mapAll").not("h3").not(".legend");
            const baseDate = $("div.live_right span.livedate").text();
            const status: ISidoStatus[] = [];

            sidoStatus.each(function (i, elem) {
                const sido = $(this).find(".cityname").text();
                const confirmed = $(this).find(".cityinfo").children().find("span.num")["0"].children[0].data;
                const dead = $(this).find(".cityinfo").children().find("span.num")["1"].children[0].data;
                
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
            const baseDate = $("div.live_left span.livedate").text();
            
            const confirmed: IStatus = {
                total: totals[0].children[1].data,
                before: befores[0].children[0].data.split('비 ')[1]
            };
            const cured: IStatus = {
                total: totals[1].children[0].data,
                before: befores[1].children[0].data
            };
            const curing: IStatus = {
                total: totals[2].children[0].data,
                before: befores[2].children[0].data
            }
            const dead: IStatus = {
                total: totals[3].children[0].data,
                before: befores[3].children[0].data
            }

            return { baseDate, confirmed, cured, curing, dead };
        } catch (err) {
            throw err;
        }
    };
};