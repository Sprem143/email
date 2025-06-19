import { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

export default function ReceiverForm({ senderEmail }) {

    const local = 'http://localhost:8000'
    const api = 'https://gmail-b.onrender.com'


    const [emails, setEmails] = useState([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [result, setResult] = useState(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            const wb = XLSX.read(evt.target.result, { type: 'binary' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            const emails = data.flat().filter(email => email)
            setEmails(data.flat().filter(email => email));
        };
        reader.readAsBinaryString(file);
    };

    const handleSend = async () => {
        const res = await axios.post(`${api}/sendemails`, {
            senderEmail, subject, message, receivers: emails,
        });
        setResult(res.data);
    };

    const handleinputemails = (emails) => {
        let emaillist = emails.split('\n').filter(Boolean)
        setEmails(emaillist)
    }

    return (
        <div>
            <h2 className='mt-4'>Send Emails</h2>

            <div className="container mt-3">
                <div className="row">
                    <div className="col-md-6 col-sm-12 d-flex flex-column" style={{ borderRight: '1px solid gray' }}>
                        <h6 className='text-start'>Subject</h6>
                        <textarea placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className='m-2' />
                        <h6 className='text-start'>Message</h6>
                        <textarea placeholder="Message (HTML allowed)" rows={10} value={message} onChange={e => setMessage(e.target.value)} className='m-2' />

                    </div>
                    <div className="col-md-6 col-sm-12">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 col-sm-12 d-flex flex-column">
                                    <h6 className='text-start mb-3'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="me-2 bi bi-file-earmark-spreadsheet" viewBox="0 0 16 16">
                                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5zM3 12v-2h2v2zm0 1h2v2H4a1 1 0 0 1-1-1zm3 2v-2h3v2zm4 0v-2h3v1a1 1 0 0 1-1 1zm3-3h-3v-2h3zm-7 0v-2h3v2z" />
                                    </svg>Select Excel file of Email</h6>
                                    <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
                                    <h5>OR</h5>
                                    <textarea name="email" id="" placeholder='List of emails' onChange={(e) => handleinputemails(e.target.value)}></textarea>
                                    <button onClick={handleSend} className='mt-4'>Send Bulk Email</button>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    {
                                        Array.isArray(emails) &&
                                        <>
                                            <h5>Total Email - {emails.length}</h5>
                                            <hr />
                                            <ol>
                                                {
                                                    emails.map((e) => (
                                                        <li>{e}</li>
                                                    ))
                                                }
                                            </ol>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>


            {result && (
                <div>
                    <p>Sent: {result.sent}</p>
                    <p>Failed: {result.failed}</p>
                </div>
            )}
        </div>
    );
}
