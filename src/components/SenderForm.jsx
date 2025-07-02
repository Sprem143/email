import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
export default function SenderForm({ onSenderChange }) {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const local = 'http://localhost:9000'
  const api = 'https://gmail-b.onrender.com'

  const [email, setEmail] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [senders, setSenders] = useState([]);
  const [showlist, setShowlist] = useState(false)
  const [editid, setEditid] = useState('')

  useEffect(() => {
    axios.get(`${api}/getsender`).then((res) => {
      setSenders(res.data);
    })
  }, []);

  const handleSave = () => {
    if (!email || !appPassword) {
      alert('Please enter both email and app password.');
      return;
    }

    axios.post(`${api}/savesender`, { email, appPassword })
      .then((res) => {
        alert(res.data.msg);
        setSenders([...senders, { email }]);
        setEmail('');
        setAppPassword('');
      })
      .catch((err) => {
        console.error('Error saving sender:', err);
        const errorMsg = err.response?.data?.error || 'Something went wrong while saving sender.';
        alert(errorMsg);
      });
  };
  function showsenderemail() {
    setShowlist(!showlist)
  }

  async function deletesenderemail(id) {
    if (!window.confirm('Are you sure you want to delete this sender?')) return;

    axios.post(`${api}/deletesenderemail`, { id })
      .then((res) => {
        alert(res.data.msg);
        setSenders(res.data.emails);
      })
      .catch((err) => {
        console.error('Error saving sender:', err);
        const errorMsg = err.response?.data?.error || 'Something went wrong while saving sender.';
        alert(errorMsg);
      });
  }

  async function editsenderemail() {

    axios.post(`${api}/editsenderemail`, { editid, email, appPassword })
      .then((res) => {
        setShow(false)
        alert(res.data.msg);
        setEmail('')
        setAppPassword('')
        setEditid('')
        setSenders(res.data.emails);

      })
      .catch((err) => {
        setShow(false)
        console.error('Error saving sender:', err);
        const errorMsg = err.response?.data?.error || 'Something went wrong while saving sender.';
        alert(errorMsg);
      });
  }
  function handleShowform(email, id) {
    setEmail(email)
    setEditid(id)
    handleShow()
  }
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value.trim())} />
          <br />
          <input placeholder="App Password" value={appPassword} onChange={e => setAppPassword(e.target.value.trim())} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={editsenderemail}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <h2>Sender Configuration</h2>
      <div className="container mt-3">
        <div className="row" >
          <div className="col-md-5 col-sm-12 border border-secondary dfjcac p-3">
            <div className="container">
              <h5>Add New Sender</h5>
              <div className="row">
                <div className="col-md-4 col-sm-12 dfjcac ">
                  <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="col-md-4 col-sm-12 dfjcac">
                  <input placeholder="App Password" value={appPassword} onChange={e => setAppPassword(e.target.value)} />
                </div>
                <div className="col-md-4 col-sm-12 dfjcac">
                  <button className='m-1 ps-4 pe-4' onClick={handleSave}>Save</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-12 border border-secondary dfjcac flex-column p-3">
            <h5>Select Sender Email</h5>
            <select onChange={e => onSenderChange(e.target.value)}>
              <option>Select</option>
              {Array.isArray(senders) && senders.map(s => <option key={s.email} value={s.email}>{s.email}</option>)}
            </select>
            {Array.isArray(senders) && <h6 className='mt-2'>Total Sender - {senders.length}</h6>}
          </div>
          <div className="col-md-3 col-sm-12 border border-secondary dfjcac p-3">
            <button onClick={showsenderemail}>{showlist ? 'Hide' : 'Manage Sender List'}</button>
          </div>
        </div>
      </div>
      {
        showlist &&
        <div className="p-4">
          <ol>
            {Array.isArray(senders) &&
              senders.map((s) => (
                <li key={s._id} className='m-2 p-1' style={{ background: '#ffffff14' }}>
                  <div className="container">
                    <div className="row">
                      <div className="col-md-2 col-sm-4">{s.email}</div>
                      <div className="col-md-2 col-sm-4">{s.Date}</div>
                      <div className="col-md-2 col-sm-4">
                        <button className="tooltip-container p-0 m-0 bg-transparent border-0" onClick={() => deletesenderemail(s._id)}>

                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                          </svg>
                          <span className="tooltip-text">Delete</span>
                        </button>
                      </div>
                      <div className="col-md-2 col-sm-4">
                        <button className="tooltip-container p-0 m-0 bg-transparent border-0" onClick={() => handleShowform(s.email, s._id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                          </svg>
                          <span className="tooltip-text">Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            }
          </ol>
        </div>
      }
    </div>
  );
}
