import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, User, Calendar, DollarSign } from 'lucide-react';

const PatentApplicationForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        refType: '', refNumber: '', appType: '', applicantName: '', gender: '', nationality: '',
        country: '', age: '', address: '', email: '', contact: '', applicantCategory: '',
        inventorSame: '', inventorName: '', inventorGender: '', inventorNationality: '',
        inventorCountry: '', inventorAge: '', inventorAddress: '', inventorEmail: '',
        inventorContact: '', title: '', agentNumber: '', agentName: '', agentMobile: '',
        serviceName: '', serviceAddress: '', servicePhone: '', serviceMobile: '', serviceFax: '',
        serviceEmail: '', convCountry: '', convAppNumber: '', convFilingDate: '', convApplicant: '',
        convTitle: '', convIPC: '', pctNumber: '', pctDate: '', divAppNumber: '', divDate: '',
        mainAppNumber: '', mainDate: '', specPages: '', claims: '', abstract: '', drawings: '',
        totalFees: '', paymentMethod: '', paymentNumber: '', paymentDate: '', paymentBank: '',
        submissionDate: '', applicantNameFinal: ''
    });

    const updateField = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));
    const nextStep = () => setStep(prev => Math.min(prev + 1, 16));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
    const [downloadUrl, setDownloadUrl] = useState(null);

    const calculateFees = () => {
        let extra = 0;
        if (parseInt(formData.specPages || '0') > 30) extra += (parseInt(formData.specPages) - 30) * 10;
        if (parseInt(formData.claims || '0') > 10) extra += (parseInt(formData.claims) - 10) * 10;
        if (parseInt(formData.abstract || '0') > 10) extra += (parseInt(formData.abstract) - 10) * 10;
        if (parseInt(formData.drawings || '0') > 10) extra += (parseInt(formData.drawings) - 10) * 10;
        return extra;
    };

    const steps = [
        { title: "Reference ID", icon: <FileText className="w-5 h-5" /> },
        { title: "Application Type", icon: <FileText className="w-5 h-5" /> },
        { title: "Applicant Details", icon: <User className="w-5 h-5" /> },
        { title: "Applicant Category", icon: <User className="w-5 h-5" /> },
        { title: "Inventor Details", icon: <User className="w-5 h-5" /> },
        { title: "Invention Title", icon: <FileText className="w-5 h-5" /> },
        { title: "Patent Agent", icon: <User className="w-5 h-5" /> },
        { title: "Service Address", icon: <User className="w-5 h-5" /> },
        { title: "Convention Details", icon: <FileText className="w-5 h-5" /> },
        { title: "PCT Details", icon: <FileText className="w-5 h-5" /> },
        { title: "Divisional Details", icon: <FileText className="w-5 h-5" /> },
        { title: "Patent Addition", icon: <FileText className="w-5 h-5" /> },
        { title: "Declarations", icon: <FileText className="w-5 h-5" /> },
        { title: "Attachments", icon: <FileText className="w-5 h-5" /> },
        { title: "Fees", icon: <DollarSign className="w-5 h-5" /> },
        { title: "Final Details", icon: <Calendar className="w-5 h-5" /> }
    ];
    const handleSubmit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/generate-doc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Patent_Form.docx";
            a.click();
            a.remove();
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Failed to fetch document. Please try again.");
        }
    };

    const renderStep = () => {
        const inputClass = "w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors";
        const selectClass = "w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white";

        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Reference/Identification No.</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Application Type</label>
                            <select className={selectClass} value={formData.refType} onChange={(e) => updateField('refType', e.target.value)}>
                                <option value="">Select Type</option>
                                <option value="provisional">Provisional</option>
                                <option value="complete">Complete</option>
                            </select>
                        </div>
                        {formData.refType === 'complete' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Application Number</label>
                                <input type="text" className={inputClass} value={formData.refNumber} onChange={(e) => updateField('refNumber', e.target.value)} />
                            </div>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Type of Application</h2>
                        <div className="grid grid-cols-3 gap-3">
                            {['Ordinary', 'Convention', 'PCT-NP', 'PPH', 'Divisional', 'Patent of Addition'].map(type => (
                                <label key={type} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="appType" value={type} checked={formData.appType === type} onChange={(e) => updateField('appType', e.target.value)} />
                                    <span className="text-sm">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Applicant Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Name" className={inputClass} value={formData.applicantName} onChange={(e) => updateField('applicantName', e.target.value)} />
                            <select className={selectClass} value={formData.gender} onChange={(e) => updateField('gender', e.target.value)}>
                                <option value="">Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Others</option>
                                <option value="prefer_not">Prefer not to disclose</option>
                            </select>
                            <input type="text" placeholder="Nationality" className={inputClass} value={formData.nationality} onChange={(e) => updateField('nationality', e.target.value)} />
                            <input type="text" placeholder="Country of Residence" className={inputClass} value={formData.country} onChange={(e) => updateField('country', e.target.value)} />
                            <input type="number" placeholder="Age" className={inputClass} value={formData.age} onChange={(e) => updateField('age', e.target.value)} />
                            <input type="text" placeholder="Address" className={inputClass} value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
                            <input type="email" placeholder="Email (OTP verification required)" className={inputClass} value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                            <input type="tel" placeholder="Contact (OTP verification required)" className={inputClass} value={formData.contact} onChange={(e) => updateField('contact', e.target.value)} />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Category of Applicant</h2>
                        <div className="space-y-3">
                            {['Natural Person', 'Educational Institution', 'Small Entity', 'Startup', 'Others'].map(cat => (
                                <label key={cat} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="applicantCategory" value={cat} checked={formData.applicantCategory === cat} onChange={(e) => updateField('applicantCategory', e.target.value)} />
                                    <span>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Inventor Details</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Are all patent owners the inventors?</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center"><input type="radio" name="inventorSame" value="yes" checked={formData.inventorSame === 'yes'} onChange={(e) => updateField('inventorSame', e.target.value)} className="mr-2" />Yes</label>
                                <label className="flex items-center"><input type="radio" name="inventorSame" value="no" checked={formData.inventorSame === 'no'} onChange={(e) => updateField('inventorSame', e.target.value)} className="mr-2" />No</label>
                            </div>
                        </div>
                        {formData.inventorSame === 'no' && (
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Inventor Name" className={inputClass} value={formData.inventorName} onChange={(e) => updateField('inventorName', e.target.value)} />
                                <select className={selectClass} value={formData.inventorGender} onChange={(e) => updateField('inventorGender', e.target.value)}>
                                    <option value="">Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                    <option value="prefer_not">Prefer not to disclose</option>
                                </select>
                                <input type="text" placeholder="Nationality" className={inputClass} value={formData.inventorNationality} onChange={(e) => updateField('inventorNationality', e.target.value)} />
                                <input type="text" placeholder="Country" className={inputClass} value={formData.inventorCountry} onChange={(e) => updateField('inventorCountry', e.target.value)} />
                                <input type="number" placeholder="Age" className={inputClass} value={formData.inventorAge} onChange={(e) => updateField('inventorAge', e.target.value)} />
                                <input type="text" placeholder="Address" className={inputClass} value={formData.inventorAddress} onChange={(e) => updateField('inventorAddress', e.target.value)} />
                                <input type="email" placeholder="Email" className={inputClass} value={formData.inventorEmail} onChange={(e) => updateField('inventorEmail', e.target.value)} />
                                <input type="tel" placeholder="Contact" className={inputClass} value={formData.inventorContact} onChange={(e) => updateField('inventorContact', e.target.value)} />
                            </div>
                        )}
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Title of Invention</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">15 Word Statement (will remain same for provisional and complete)</label>
                            <textarea className={inputClass} rows={3} value={formData.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Enter invention title (max 15 words)"></textarea>
                        </div>
                    </div>
                );

            case 7:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Authorized Patent Agent</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="IN/PA Number" className={inputClass} value={formData.agentNumber} onChange={(e) => updateField('agentNumber', e.target.value)} />
                            <input type="text" placeholder="Agent Name" className={inputClass} value={formData.agentName} onChange={(e) => updateField('agentName', e.target.value)} />
                            <input type="tel" placeholder="Mobile (OTP verification required)" className={inputClass} value={formData.agentMobile} onChange={(e) => updateField('agentMobile', e.target.value)} />
                        </div>
                    </div>
                );

            case 8:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Address for Service in India</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Name" className={inputClass} value={formData.serviceName} onChange={(e) => updateField('serviceName', e.target.value)} />
                            <input type="text" placeholder="Postal Address" className={inputClass} value={formData.serviceAddress} onChange={(e) => updateField('serviceAddress', e.target.value)} />
                            <input type="tel" placeholder="Phone" className={inputClass} value={formData.servicePhone} onChange={(e) => updateField('servicePhone', e.target.value)} />
                            <input type="tel" placeholder="Mobile (OTP required)" className={inputClass} value={formData.serviceMobile} onChange={(e) => updateField('serviceMobile', e.target.value)} />
                            <input type="tel" placeholder="Fax" className={inputClass} value={formData.serviceFax} onChange={(e) => updateField('serviceFax', e.target.value)} />
                            <input type="email" placeholder="Email (OTP required)" className={inputClass} value={formData.serviceEmail} onChange={(e) => updateField('serviceEmail', e.target.value)} />
                        </div>
                    </div>
                );

            case 9:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Convention Application Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Country" className={inputClass} value={formData.convCountry} onChange={(e) => updateField('convCountry', e.target.value)} />
                            <input type="text" placeholder="Application Number" className={inputClass} value={formData.convAppNumber} onChange={(e) => updateField('convAppNumber', e.target.value)} />
                            <input type="date" placeholder="Filing Date" className={inputClass} value={formData.convFilingDate} onChange={(e) => updateField('convFilingDate', e.target.value)} />
                            <input type="text" placeholder="Applicant Name" className={inputClass} value={formData.convApplicant} onChange={(e) => updateField('convApplicant', e.target.value)} />
                            <input type="text" placeholder="Title of Invention" className={inputClass} value={formData.convTitle} onChange={(e) => updateField('convTitle', e.target.value)} />
                            <input type="text" placeholder="IPC Classification" className={inputClass} value={formData.convIPC} onChange={(e) => updateField('convIPC', e.target.value)} />
                        </div>
                    </div>
                );

            case 10:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">PCT National Phase Application</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="International Application Number" className={inputClass} value={formData.pctNumber} onChange={(e) => updateField('pctNumber', e.target.value)} />
                            <input type="date" placeholder="International Filing Date" className={inputClass} value={formData.pctDate} onChange={(e) => updateField('pctDate', e.target.value)} />
                        </div>
                    </div>
                );

            case 11:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Divisional Application Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Original Application Number" className={inputClass} value={formData.divAppNumber} onChange={(e) => updateField('divAppNumber', e.target.value)} />
                            <input type="date" placeholder="Filing Date of Original Application" className={inputClass} value={formData.divDate} onChange={(e) => updateField('divDate', e.target.value)} />
                        </div>
                    </div>
                );

            case 12:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Patent of Addition Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Main Application/Patent Number" className={inputClass} value={formData.mainAppNumber} onChange={(e) => updateField('mainAppNumber', e.target.value)} />
                            <input type="date" placeholder="Filing Date of Main Application" className={inputClass} value={formData.mainDate} onChange={(e) => updateField('mainDate', e.target.value)} />
                        </div>
                    </div>
                );

            case 13:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Declarations</h2>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">By proceeding, you declare that:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                                <li>You are in possession of the mentioned invention</li>
                                <li>The specification relating to the invention is filed with this application</li>
                                <li>There is no lawful ground of objection to the grant of Patent</li>
                                <li>You are the true & first inventor(s) or assignee/legal representative</li>
                                <li>The digital signature should be added in the form at places required</li>
                            </ul>
                        </div>
                    </div>
                );

            case 14:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Attachments</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Specification Pages</label>
                                <input type="number" placeholder="Number of pages" className={inputClass} value={formData.specPages} onChange={(e) => updateField('specPages', e.target.value)} />
                                {parseInt(formData.specPages || '0') > 30 && <p className="text-sm text-red-600">Extra charge: ₹{(parseInt(formData.specPages) - 30) * 10}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Claims</label>
                                <input type="number" placeholder="Number of claims" className={inputClass} value={formData.claims} onChange={(e) => updateField('claims', e.target.value)} />
                                {parseInt(formData.claims || '0') > 10 && <p className="text-sm text-red-600">Extra charge: ₹{(parseInt(formData.claims) - 10) * 10}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Abstract Pages</label>
                                <input type="number" placeholder="Number of pages" className={inputClass} value={formData.abstract} onChange={(e) => updateField('abstract', e.target.value)} />
                                {parseInt(formData.abstract || '0') > 10 && <p className="text-sm text-red-600">Extra charge: ₹{(parseInt(formData.abstract) - 10) * 10}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Drawings</label>
                                <input type="number" placeholder="Number of drawings" className={inputClass} value={formData.drawings} onChange={(e) => updateField('drawings', e.target.value)} />
                                {parseInt(formData.drawings) > 10 && <p className="text-sm text-red-600">Extra charge: ₹{(parseInt(formData.drawings) - 10) * 10}</p>}
                            </div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-lg font-semibold text-blue-800">Total Extra Charges: ₹{calculateFees()}</p>
                        </div>
                    </div>
                );

            case 15:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Total Fees</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Base Fee Amount (₹1600-4000)</label>
                                <input type="number" min="1600" max="4000" placeholder="Enter amount" className={inputClass} value={formData.totalFees} onChange={(e) => updateField('totalFees', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                <select className={selectClass} value={formData.paymentMethod} onChange={(e) => updateField('paymentMethod', e.target.value)}>
                                    <option value="">Select Method</option>
                                    <option value="cash">Cash</option>
                                    <option value="check">Check</option>
                                    <option value="draft">Bank Draft</option>
                                </select>
                            </div>
                            {formData.paymentMethod !== 'cash' && formData.paymentMethod && (
                                <>
                                    <input type="text" placeholder="Payment Number" className={inputClass} value={formData.paymentNumber} onChange={(e) => updateField('paymentNumber', e.target.value)} />
                                    <input type="date" placeholder="Payment Date" className={inputClass} value={formData.paymentDate} onChange={(e) => updateField('paymentDate', e.target.value)} />
                                    <input type="text" placeholder="Bank Name" className={inputClass} value={formData.paymentBank} onChange={(e) => updateField('paymentBank', e.target.value)} />
                                </>
                            )}
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-lg font-semibold text-green-800">Total Amount: ₹{parseInt(formData.totalFees || '0') + calculateFees()}</p>
                        </div>
                    </div>
                );

            case 16:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Final Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" placeholder="Submission Date" className={inputClass} value={formData.submissionDate} onChange={(e) => updateField('submissionDate', e.target.value)} />
                            <input type="text" placeholder="Applicant Name" className={inputClass} value={formData.applicantNameFinal} onChange={(e) => updateField('applicantNameFinal', e.target.value)} />
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Form Summary</h3>
                            <div className="text-sm space-y-2 max-h-60 overflow-y-auto">
                                {Object.entries(formData).filter(([key, value]) => value).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span className="font-medium">{key}:</span>
                                        <span className="text-gray-600">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Form 1</h1>
                        <div className="text-sm text-gray-600">Step {step} of 16</div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-4">
                            {steps[step - 1].icon}
                            <span className="text-lg font-semibold">{steps[step - 1].title}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 16) * 100}%` }}></div>
                        </div>
                    </div>

                    <div className="mb-8">
                        {renderStep()}
                    </div>

                    <div className="flex justify-between">
                        <button onClick={prevStep} disabled={step === 1} className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </button>
                        <button
                            onClick={step === 16 ? handleSubmit : nextStep}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {step === 16 ? 'Submit & Download' : 'Next'}
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatentApplicationForm;