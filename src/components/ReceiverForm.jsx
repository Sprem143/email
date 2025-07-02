import { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../App.css'
import ClockLoader from "react-spinners/ClockLoader";

export default function ReceiverForm({ senderEmail }) {

    const local = 'http://localhost:9000'
    const api = 'https://gmail-b.onrender.com'
    const [theme, setTheme] = useState('')
    const [loading, setLoading] = useState(false)

    const [emails, setEmails] = useState([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [newmessage, setnewMessage] = useState('');
    const [result, setResult] = useState(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            const wb = XLSX.read(evt.target.result, { type: 'binary' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            setEmails(data.flat().filter(email => email));
        };
        reader.readAsBinaryString(file);
    };

    const handleSend = async () => {
        setLoading(true)
        // const res = await axios.post(`http://localhost:8000/sendemails`, {
        const res = await axios.post(`https://gmail-b-py.onrender.com/sendemails`, {
            senderEmail, subject, newmessage, receivers: emails,
        });
        setLoading(false)
        setResult(res.data);
    };

    const handleinputemails = (emails) => {
        let emaillist = emails.split('\n').filter(Boolean)
        setEmails(emaillist)
    }

    function handletheme(theme) {
        setTheme(theme)
        if (theme == 'theme02') {
            let modifiedmsg = `${message}
            <div style="display: flex; flex-direction: column; align-items:baseline font-family: Arial, sans-serif;">
  <b style="font-family: cursive;">Regards,</b><br />
  <b style="font-family: cursive;">Saurabh Parwal,</b><br />
  <img src="https://res.cloudinary.com/dfnzn3frw/image/upload/v1750326177/gstar_g4jkrf.png" alt="Gstar Logo" height="80" /><br />
  <p style="margin: 5px 0;">
    <b>USA:</b> +1-602-834-2296<br />
    <b>India:</b> +91-8447770402
  </p>
  <p style="margin: 5px 0;">
    <b>Email:</b>
    <a href="mailto:saurabh@gstarinfotech.com" style="text-decoration: none; color: #000;">
      saurabh@gstarinfotech.com
    </a>
  </p>
  <p style="margin: 5px 0;">
    <b>Website:</b>
    <a href="https://www.gstarinfotech.com" style="text-decoration: none; color: #000;">
      www.gstarinfotech.com
    </a>
  </p>
  <p style="margin: 5px 0;">
    <b>Skype:</b>
    <a href="skype:sales@gstarinfotech.com?chat" style="text-decoration: none; color: #000;">
      sales@gstarinfotech.com
    </a>
  </p>
</div>
            `
            setnewMessage(modifiedmsg)
            console.log(modifiedmsg)
        } else {
            setnewMessage(message)
            console.log(message)
        }

    }
    return (
        <div style={{ marginTop: '30px' }}>
            <h2 className='mt-4'>Send Emails</h2>

            <div className="container mb-4" style={{ minHeight: '250px' }}>

                <div className="row">
                    <div className="col-md-6 col-sm-12 d-flex flex-column textEditor" style={{ borderRight: '1px solid gray' }}>
                        <h6 className='text-start'>Subject</h6>
                        <textarea placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className='m-2' />
                        <h6 className='text-start'>Message</h6>
                        <ReactQuill
                            theme="snow"
                            value={message}
                            onChange={setMessage}
                            placeholder="Message (HTML allowed)"
                            className="m-2"
                            style={{ zIndex: '1' }}
                        />

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
                                    <select name="Theme" className='mt-2' onChange={(e) => handletheme(e.target.value)}>
                                        <option value="theme01">Select Theme</option>
                                        <option value="theme01">Theme I</option>
                                        <option value="theme02">Theme II</option>
                                    </select>
                                    {theme && <button onClick={handleSend} className='mt-4'>Send Bulk Email</button>}
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
                                {loading && (
                                    <div className="sweet-loading" style={{ left: '45%', marginTop: '10px' }}>
                                        <div style={{ display: 'grid', placeItems: 'center' }}>
                                            <div >
                                                <ClockLoader color="white" loading={loading} cssOverride={{ display: "block", borderColor: "red" }} size={100} aria-label="Loading Spinner" data-testid="loader" />
                                                <h3 className='mt-2 text-center'>Please Wait...</h3>
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {result && (
                                    <div className='mt-4'>
                                        <h3 className='bg-success'>Sent: {result.sent}</h3>
                                        <h3 className='bg-danger'>Failed: {result.failed}</h3>
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>

                </div>
            </div>


            {/* ----email sample----- */}
            <div className="container" style={{ marginTop: '60px' }}>
                <h3>Preview</h3>
                <hr />
                <div className="row">
                    <div className="col-md-4 col-sm-12" style={{ borderRight: '1px solid gray' }}>
                        <div className="dfjcac" style={{ background: 'white', color: 'black' }}>
                            <span className="fs-4"> Theme-I</span>
                        </div>
                        <div className="preview-container mt-4">
                            <div
                                className="preview-content"
                                dangerouslySetInnerHTML={{ __html: message }}
                            />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12" style={{ borderRight: '1px solid gray' }}>
                        <div className="dfjcac" style={{ background: 'white', color: 'black' }}>
                            <span className="fs-4"> Theme-II</span>
                        </div>


                        <div className='d-flex flex-column align-items-baseline p-4'>
                            <div className="preview-container">
                                <div
                                    className="preview-content"
                                    dangerouslySetInnerHTML={{ __html: message }}
                                />
                            </div>
                            <b style={{ fontFamily: 'cursive' }}>Regards,</b>
                            <b style={{ fontFamily: 'cursive' }}>Saurabh Parwal,</b> <br />
                            <img src="https://res.cloudinary.com/dfnzn3frw/image/upload/v1750326177/gstar_g4jkrf.png" alt="" height={80} />
                            <p><b>USA: </b>+1-602-834-2296 <br />
                                <b>India: </b>+91-8447770402</p>
                            <span>    <b>E: </b><a href="mailto:saurabh@gstarinfotech.com" target='_blank' style={{ textDecoration: 'none' }}>saurabh@gstarinfotech.com</a> </span>
                            <span>   <b>W: </b><a href="www.gstarinfotech.com" target='_blank' style={{ textDecoration: 'none' }}>www.gstarinfotech.com</a>  </span>
                            <span>  <b>E: </b><a href="skype:sales@gstarinfotech.com?chat" style={{ textDecoration: 'none' }}>sales@gstarinfotech.com</a> </span>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <div className="dfjcac" style={{ background: 'white', color: 'black' }}>
                            <span className="fs-4"> Selected Theme</span>
                        </div>
                        <div className="preview-container mt-4">
                            <div
                                className="preview-content"
                                dangerouslySetInnerHTML={{ __html: newmessage }}
                            />
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
