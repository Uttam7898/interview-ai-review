const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

const USE_MOCK = !process.env.MONGO_URI
const mockReports = new Map()




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    let resumeText = ""
    if (req.file && req.file.buffer) {
        try {
            const parsed = await (new pdfParse.PDFParse(new Uint8Array(req.file.buffer))).getText()
            resumeText = parsed.text || ""
        } catch (err) {
            console.warn("Could not extract PDF text:", err.message)
            resumeText = req.file.originalname || "Uploaded resume"
        }
    }

    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription
    })

    if (USE_MOCK) {
        const id = `mock-${Math.random().toString(36).slice(2,9)}`
        const interviewReport = {
            _id: id,
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi,
            createdAt: new Date()
        }
        mockReports.set(id, interviewReport)

        return res.status(201).json({ message: "Interview report generated successfully.", interviewReport })
    }

    const interviewReport = await interviewReportModel.create({ user: req.user.id, resume: resumeText, selfDescription, jobDescription, ...interViewReportByAi })

    res.status(201).json({ message: "Interview report generated successfully.", interviewReport })

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params
    if (USE_MOCK) {
        const interviewReport = mockReports.get(interviewId)
        if (!interviewReport || interviewReport.user !== req.user.id) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        return res.status(200).json({ message: "Interview report fetched successfully.", interviewReport })
    }

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    res.status(200).json({ message: "Interview report fetched successfully.", interviewReport })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    if (USE_MOCK) {
        const reports = Array.from(mockReports.values()).filter(r => r.user === req.user.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(r => {
            const copy = { ...r }
            delete copy.resume
            delete copy.selfDescription
            delete copy.jobDescription
            delete copy.technicalQuestions
            delete copy.behavioralQuestions
            delete copy.skillGaps
            delete copy.preparationPlan
            return copy
        })

        return res.status(200).json({ message: "Interview reports fetched successfully.", interviewReports: reports })
    }

    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({ message: "Interview reports fetched successfully.", interviewReports })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params
    if (USE_MOCK) {
        const interviewReport = mockReports.get(interviewReportId)
        if (!interviewReport || interviewReport.user !== req.user.id) return res.status(404).json({ message: "Interview report not found." })

        const { resume, jobDescription, selfDescription } = interviewReport
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf` })
        return res.send(pdfBuffer)
    }

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf` })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }