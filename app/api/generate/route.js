import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        //retrieve API key from environmnet variable
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        //set gemini model to use
        const model = genAI.getGenerativeModel({model: "gemini-pro"})
        //receive "prompt" from request
        const data = await req.json()
        //set actual prompt from request
        const prompt = data.body
        //generate ai response from the model
        const result = await model.generateContent(prompt)
        const response = await result.response;
        const output = await response.text()
        //return response
        return NextResponse.json({output:output})
    } catch (error) {
        console.log("GenAI request error: %s", error)
    }
}