import axios from 'axios';
import React, { useState } from 'react';

const FormInput = () => {
    const [file, setFile] = useState(null);
    const [fileContent, setFileContent] = useState('');

    // const handleFileChange = (e) => {
    //     const selectedFile = e.target.files[0];
    //     setFile(selectedFile);
    //     console.log('Selected file:', selectedFile);
        
    //     if (selectedFile) {
    //         const reader = new FileReader();
    //         reader.onload = (event) => {
    //             console.log('File content:', event.target.result);
    //             setFileContent(event.target.result); // Set the file content
    //             console.log('File content:', fileContent);
                
    //         };
    //         reader.readAsText(selectedFile); // Read the file as text
    //     }
    // };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFileContent(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
        console.log('File content:', fileContent);
        
    };

    const handleUpload =  () => {
        const base64Content = fileContent.split(',')[1]; // Remove the data URL prefix
        const decodedText = atob(base64Content); // Decode Base64 to text

        try{
            console.log('Decoded text:', decodedText);
            axios.post('http://localhost:6000/upload', {
                file: "Hi"
            }).then((res) => {
                console.log('Response:', res.data);
            }).catch((err) => {
                console.log('Error:', err);
            });
        }catch(err){
            console.log(err);
        }
       
    };

    return (
        <div className='min-h-screen bg-red-300'>
            <div>
                <div className='text-center bg-white text-3xl py-10'>
                    <h1>Welcome to Das GPT</h1>
                </div>
                <div className='mx-auto w-1/2 bg-white p-4 m-4'>
                    <input 
                        type='file' 
                        className='border-2 border-black rounded-lg m-4 p-2 bg-gray-300 font-bold' 
                        onChange={handleFileChange} 
                    />
                </div>
                <button 
                    onClick={handleUpload} 
                    className='bg-black text-white cursor-pointer'
                >
                    Upload
                </button>
                <div className='w-1/2 h-[600px] mx-auto bg-white p-4'>
                    <div className='text-center'>
                        <p>Your summary ...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormInput;