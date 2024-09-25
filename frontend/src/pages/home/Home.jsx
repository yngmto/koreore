import React from 'react';
import Topbar from '../../components/topbar/Topbar';
import Footer from '../../components/footer/Footer';
import Timeline from '../../components/timeline/Timeline';
import axios from 'axios';

export default function Home() {
  const API_URL = process.env.REACT_APP_API_URL;

  const testConnection = async () => {
    try {

      const response = await axios.get(`${API_URL}/api/test`);
      console.log(response.data.message);
    } catch (error) {
      console.error("接続テストエラー:", error);
    }
  }
  testConnection();


  return (
    <>
      <Topbar />
      <Timeline />
      <Footer />
    </>
  )
}
