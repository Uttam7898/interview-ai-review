import React, { useState, useRef } from 'react'
import "../style/home.scss"
import Navbar from '../../../components/Navbar.jsx'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const SAMPLE_TEMPLATES = [
    {
        title: "Frontend Engineer",
        description: "Senior Frontend Engineer at TechCorp. Requirements: 4+ years experience with React, TypeScript, state management (Redux/Zustand), Web Performance optimization, CSS Architecture (SASS/Tailwind), and REST/GraphQL APIs. Strong understanding of web security, accessibility (a11y), and CI/CD pipelines."
    },
    {
        title: "Fullstack Node/React Developer",
        description: "Full Stack Developer required. Stack: Node.js, Express, MongoDB/PostgreSQL, React, JWT Authentication, Redis caching, and Docker. Responsibilities include building scalable microservices, designing RESTful APIs, and implementing responsive UI dashboards."
    },
    {
        title: "Data & AI Engineer",
        description: "Data & AI Engineer role. Requires proficiency in Python, BigQuery/Snowflake, PySpark, SQL query optimization, LLM prompt engineering, and building automated data pipelines with Airflow or Dataform."
    }
]

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ selectedFile, setSelectedFile ] = useState(null)
    const [ isDragging, setIsDragging ] = useState(false)
    const [ generatingStateText, setGeneratingStateText ] = useState("Analyzing job requirements & profile...")
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            setSelectedFile(file)
            if (resumeInputRef.current) {
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                resumeInputRef.current.files = dataTransfer.files
            }
        }
    }

    const removeFile = (e) => {
        e.stopPropagation()
        setSelectedFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleGenerateReport = async () => {
        if (!jobDescription.trim()) {
            alert("Please provide a target job description.")
            return
        }

        if (!selectedFile && !selfDescription.trim()) {
            alert("Please upload a resume or enter a brief self-description so AI can evaluate your profile.")
            return
        }

        setIsSubmitting(true)
        setGeneratingStateText("Extracting key skills & requirements...")

        const timer1 = setTimeout(() => setGeneratingStateText("Matching profile against job criteria..."), 2000)
        const timer2 = setTimeout(() => setGeneratingStateText("Generating technical & behavioral Q&As..."), 4500)
        const timer3 = setTimeout(() => setGeneratingStateText("Crafting 7-day preparation roadmap..."), 7000)

        try {
            const resumeFile = selectedFile || (resumeInputRef.current?.files?.[0] || null)
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data && data._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (err) {
            console.error("Error generating report:", err)
            alert("Failed to generate report. Please try again.")
        } finally {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
            setIsSubmitting(false)
        }
    }

    const applyTemplate = (desc) => {
        setJobDescription(desc)
    }

    const getQualityStatus = () => {
        const len = jobDescription.length
        if (len === 0) return { label: 'Empty', class: 'quality--none' }
        if (len < 100) return { label: 'Too Short', class: 'quality--poor' }
        if (len < 300) return { label: 'Good Start', class: 'quality--fair' }
        return { label: 'Optimal Detail', class: 'quality--great' }
    }

    const quality = getQualityStatus()

    return (
        <div className='home-page-layout'>
            <Navbar />

            <div className='home-container'>
                {/* Hero Banner Header */}
                <header className='hero-section'>
                    <div className='hero-pill'>
                        <span className='hero-pill__icon'>✨</span>
                        <span>AI-Powered Career Intelligence</span>
                    </div>

                    <h1 className='hero-title'>
                        Master Your Next Interview with <br />
                        <span className='gradient-text'>Precision AI Strategy</span>
                    </h1>

                    <p className='hero-subtitle'>
                        Paste your target job description and profile. Our AI engine extracts technical requirements, predicts targeted questions, identifies skill gaps, and builds a customized 7-day preparation plan.
                    </p>

                    <div className='hero-features'>
                        <div className='feature-chip'>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            <span>Instant Analysis (~30s)</span>
                        </div>
                        <div className='feature-chip'>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span>ATS Match Score</span>
                        </div>
                        <div className='feature-chip'>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            <span>7-Day Prep Roadmap</span>
                        </div>
                    </div>
                </header>

                {/* Main Interactive Workspace Card */}
                <div className='workspace-card'>
                    <div className='workspace-card__body'>

                        {/* Left Panel: Target Job Description */}
                        <div className='panel panel--left'>
                            <div className='panel__header'>
                                <div className='panel__header-title'>
                                    <div className='panel-icon panel-icon--purple'>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                    </div>
                                    <div>
                                        <h2>Target Job Description</h2>
                                        <p className='panel-sub'>Paste the role requirements to target</p>
                                    </div>
                                </div>
                                <span className={`badge ${quality.class}`}>{quality.label}</span>
                            </div>

                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className='panel__textarea'
                                placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, state management, and large-scale system design...'`}
                                maxLength={5000}
                            />

                            <div className='panel-footer-meta'>
                                <div className='quick-templates'>
                                    <span className='templates-label'>Quick sample:</span>
                                    {SAMPLE_TEMPLATES.map((tmpl, i) => (
                                        <button key={i} onClick={() => applyTemplate(tmpl.description)} className='template-btn'>
                                            {tmpl.title}
                                        </button>
                                    ))}
                                </div>
                                <span className='char-counter'>{jobDescription.length} / 5000</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className='panel-divider'>
                            <div className='divider-badge'>VS</div>
                        </div>

                        {/* Right Panel: Candidate Profile */}
                        <div className='panel panel--right'>
                            <div className='panel__header'>
                                <div className='panel__header-title'>
                                    <div className='panel-icon panel-icon--blue'>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </div>
                                    <div>
                                        <h2>Candidate Profile</h2>
                                        <p className='panel-sub'>Upload resume or write a quick summary</p>
                                    </div>
                                </div>
                            </div>

                            {/* Dropzone Upload */}
                            <div className='upload-section'>
                                <label className='section-label'>
                                    <span>Upload Resume (PDF / DOCX)</span>
                                    <span className='badge badge--best'>Best Results</span>
                                </label>
                                
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => resumeInputRef.current?.click()}
                                    className={`dropzone ${isDragging ? 'dropzone--dragging' : ''} ${selectedFile ? 'dropzone--has-file' : ''}`}
                                >
                                    {selectedFile ? (
                                        <div className='file-preview'>
                                            <div className='file-icon'>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                            </div>
                                            <div className='file-details'>
                                                <span className='file-name'>{selectedFile.name}</span>
                                                <span className='file-size'>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                            <button onClick={removeFile} className='remove-file-btn' title="Remove File">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className='dropzone__icon'>
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                            </span>
                                            <p className='dropzone__title'>Click to browse or drag & drop resume</p>
                                            <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                        </>
                                    )}

                                    <input
                                        ref={resumeInputRef}
                                        onChange={handleFileChange}
                                        hidden
                                        type='file'
                                        id='resume'
                                        name='resume'
                                        accept='.pdf,.docx'
                                    />
                                </div>
                            </div>

                            <div className='or-divider'>
                                <span>OR</span>
                            </div>

                            {/* Self Description Textarea */}
                            <div className='self-description'>
                                <label className='section-label' htmlFor='selfDescription'>
                                    Quick Self-Description
                                </label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='panel__textarea panel__textarea--short'
                                    placeholder="Briefly describe your experience, key skills, and years in tech if you don't have a resume handy..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className='workspace-card__footer'>
                        <div className='footer-info'>
                            <span className='pulse-dot'></span>
                            <span>Powered by Gemini 2.5 AI Engine &bull; ~30s Generation</span>
                        </div>

                        <button
                            onClick={handleGenerateReport}
                            disabled={loading || isSubmitting}
                            className='generate-btn'
                        >
                            {loading || isSubmitting ? (
                                <>
                                    <span className='btn-spinner'></span>
                                    <span>{generatingStateText}</span>
                                </>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                                    <span>Generate AI Interview Strategy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Recent Interview Reports Section */}
                {reports && reports.length > 0 && (
                    <section className='recent-reports-section'>
                        <div className='section-header'>
                            <div>
                                <h2>Your Recent Interview Plans</h2>
                                <p>Access and review your previously generated strategy reports</p>
                            </div>
                            <span className='report-count-badge'>{reports.length} Reports</span>
                        </div>

                        <div className='reports-grid'>
                            {reports.map(report => {
                                const scoreClass = report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'
                                return (
                                    <div
                                        key={report._id}
                                        className='report-card'
                                        onClick={() => navigate(`/interview/${report._id}`)}
                                    >
                                        <div className='report-card__header'>
                                            <h3>{report.title || 'Untitled Position'}</h3>
                                            <span className={`match-badge ${scoreClass}`}>
                                                {report.matchScore || 75}% Match
                                            </span>
                                        </div>

                                        <p className='report-card__date'>
                                            Generated on {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>

                                        <div className='report-card__action'>
                                            <span>View Report</span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                <footer className='main-footer'>
                    <p>© 2026 InterviewAI. All rights reserved.</p>
                    <div className='footer-links'>
                        <a href='#'>Privacy Policy</a>
                        <a href='#'>Terms of Service</a>
                        <a href='#'>Documentation</a>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Home