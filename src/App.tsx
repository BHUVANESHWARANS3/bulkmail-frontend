import { useRef, useState } from 'react'
import './App.css'
import * as XLSX from 'xlsx';
import axios from 'axios';
function App() {
  const [message,setMessage] = useState<string>('');
  const reff = useRef<HTMLInputElement>(null);
  const [emails, setEmails] = useState<string[]>([]);
  const [count,setCount] = useState<number>(0);

  function handle() {
    const file = reff.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const text = event.target?.result;
        console.log(text);
        let data = XLSX.read(text, { type: 'binary' });
        const keys = Object.keys(data['Sheets']['Sheet1']);
        const arr: string[] = [];
        keys.map((key, index) => {
          if (index < keys.length - 1) {
            arr.push(data['Sheets']['Sheet1'][key]['v']);
          }
        });
        setEmails(arr);
        console.log(arr);
      }
      reader.readAsArrayBuffer(file);
    }

  }
  async function send(){
    setCount(1);
      await axios.post('https://bulkmail-backend-psi.vercel.app/send',{emails:emails,message:message}).then((res)=>{
        alert(res.data);
        setCount(0);
      }).catch(()=>{
        alert('Error sending emails');
      })
  }
  return (
    <>
      <div>
        <h1 className='text-center text-3xl text-[#FFD700] font-bold p-5 bg-blue-900'>BulkMailer</h1>
        <p className='text-center text-blue-900 text-2xl text-blue font-semibold p-5 bg-green-300'>We don't just deliver; we deliver on our promises.</p>
        <div className='flex flex-col gap-3 items-center justify-center px-1'>
          <textarea value={message} onChange={(e)=>{
            setMessage(e.target.value);
          }} placeholder='Enter plain text or in html format to structure the email' className='border border-black md:w-1/2 w-full p-5 mt-5 h-[300px] outline-none' ></textarea>
          <input type='file' className='translate-x-1/4' ref={reff} onChange={handle} ></input>
          <button className='text-xl bg-blue-300 p-3 rounded-md mt-3' onClick={send}>{count==0 ? "send" : "sending..."}</button>
        </div>

      </div>

    </>
  )
}

export default App
