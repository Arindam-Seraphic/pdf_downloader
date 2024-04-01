// pages/api/download-pdf.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import axios from "axios";
import fs from "fs";
import path from "path";

async function autoDownloadPDF(inputValue:string) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--disable-plugins"],
        });

        const page = await browser.newPage();

        await page.goto(
            "https://www2.agenciatributaria.gob.es/wlpl/inwinvoc/es.aeat.dit.adu.eeca.catalogo.vis.VisualizaSc?COMPLETA=NO&ORIGEN=J"
        );

        await page.waitForSelector("#CSV");

        await page.type("#CSV", inputValue);

        await page.click("#Enviar");

        await page.waitForNavigation();

        const iframeSrc = await page.evaluate(() => {
            const iframe = document.querySelector("iframe");
            return iframe ? iframe.src : null;
        });

        if (!iframeSrc) {
            throw new Error("PDF iframe not found.");
        }

        const pdfResponse = await axios.get(iframeSrc, {
            responseType: "stream",
        });

        const downloadsDir = path.join(__dirname, "downloads");
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir);
        }

        const filePath = path.join(downloadsDir, "downloaded.pdf");
        const writer = fs.createWriteStream(filePath);
        pdfResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        console.log("PDF downloaded successfully:", filePath);

        await browser.close();

        return filePath;
    } catch (error) {
        console.error("Error occurred:", error);
        throw error;
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        console.log("Received data:", data);

        const filePath = await autoDownloadPDF(data.inputValue);

        return NextResponse.json({ message: "PDF downloaded successfully", filePath });
    } catch (error) {
        console.error("Error occurred:", error);
        return NextResponse.json({ error: "Failed to download PDF" }, { status: 500 });
    }
}
