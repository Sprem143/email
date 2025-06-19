import { useState } from 'react';
import SenderForm from './components/SenderForm';
import ReceiverForm from './components/ReceiverForm';

function App() {
  const [senderEmail, setSenderEmail] = useState('');

  return (
    <div className='p-4'>
      <SenderForm onSenderChange={setSenderEmail} />
      {senderEmail && <ReceiverForm senderEmail={senderEmail} />}
    </div>
  );
}

export default App;
