import React, { useState } from 'react';
import axios from 'axios';
import styles from './BoiNgaySinh.module.css';
import { Analytics } from '@vercel/analytics/react';
import { getAccessToken, getUser } from '../auth/auth';
import { ReadAloudButton } from '../readAloud/ReadAloudButton';



function BoiNgaySinh() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [dayMeaning, setdayMeaning] = useState('');
  const [monthMeaning, setMonthMeaning] = useState('');
  const [yearMeaning, setYearMeaning] = useState('');
  const [soChuDao, setSoChuDao] = useState('');
  const [overallMessage, setOverallMessage] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const origin = window.location.origin;
      const accessToken = getAccessToken(origin);
      const userString = getUser(origin);
      const user = JSON.parse(userString);
      const userId = user._id;
      if (!accessToken) {
        console.error('Access token not found');
        return;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const requestBody = {
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year),
        userId: userId,
      };

      const response = await axios.post('http://localhost:5000/api/boi-ngay-sinh', requestBody, { headers });
      const { zodiacSign, dayMeaning, monthMeaning, yearMeaning, soChuDao, summarizedMeaning } = response.data;

      if (summarizedMeaning) {
        setZodiacSign(zodiacSign);
        setdayMeaning(dayMeaning);
        setMonthMeaning(monthMeaning);
        setYearMeaning(yearMeaning);
        setSoChuDao(soChuDao);
        setOverallMessage(summarizedMeaning);
        setShowResult(true);
      } else {
        setZodiacSign(zodiacSign);
        setdayMeaning(dayMeaning);
        setMonthMeaning(monthMeaning);
        setYearMeaning(yearMeaning);
        setSoChuDao(soChuDao);

        // Send the meanings to the http-server to get the overall message
        const dateOfBirthMeanings = [
          { Mean: zodiacSign },
          { Mean: dayMeaning },
          { Mean: monthMeaning },
          { Mean: yearMeaning },
          { Mean: soChuDao },
        ];

        const summarizeResponse = await axios.post('http://localhost:5000/api/get-overall-message', dateOfBirthMeanings);
        const { summarizedMeaning } = summarizeResponse.data;
        setOverallMessage(summarizedMeaning);
        setShowResult(true);
      }
    } catch (error) {
      console.error('Error fetching birth date meanings:', error);
    }
  };

  const handleDayChange = (e) => {
    setDay(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  return (
    <div className={styles['BoiNgaySinh']}>
      <div className={styles['Banner-Welcome']}>
        <h1 className={styles['Boi-Ngay-Sinh']}>Bói ngày sinh</h1>
        <p className={styles['text-Boi-Ngay-Sinh']}>
          Bói ngày sinh - khám phá ý nghĩa và tiềm năng của bản thân qua ngày tháng năm sinh. Hãy nhập thông tin của bạn và để chúng tôi giải mã những bí ẩn của cuộc đời bạn!
        </p>
      </div>
      <form className={styles['Body']} onSubmit={handleSubmit}>
        <div className={styles['Input-area']}>
          <ul>
            <li>
              <div className={styles['input-container']}>
                <div className={styles['input-text']}>
                  <p>Ngày</p>
                </div>
                <div className={styles['input-area']}>
                  <select
                    className={styles['select']}
                    name="day"
                    size={1}
                    value={day}
                    onChange={handleDayChange}
                  >
                    <option value="">Select Day</option>
                    {Array.from({ length: 31 }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </li>
            <li>
              <div className={styles['input-container']}>
                <div className={styles['input-text']}>
                  <p>Tháng</p>
                </div>
                <div className={styles['input-area']}>
                  <select
                    className={styles['select']}
                    name="month"
                    size={1}
                    value={month}
                    onChange={handleMonthChange}
                  >
                    <option value="">Select Month</option>
                    {Array.from({ length: 12 }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </li>
            <li>
              <div className={styles['input-container']}>
                <div className={styles['input-text']}>
                  <p>Năm</p>
                </div>
                <div className={styles['input-area']}>
                  <select
                    className={styles['select']}
                    name="year"
                    size={1}
                    value={year}
                    onChange={handleYearChange}
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 80 }, (_, index) => (
                      <option key={index + 1950} value={index + 1950}>
                        {index + 1950}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className={styles['Button-area']}>
          <button type="submit">Xem ngay</button>
        </div>
      </form>
      {showResult && (
        <div className={styles['summarizedMeaning']}>
          <h2>Kết quả:</h2>
          <div className={styles['overall-message']}>
            <h3>Tổng quan:</h3>
            <p>{overallMessage}</p>
            <ReadAloudButton text={overallMessage} />
          </div>
          <div className={styles['result-items-container']}>
            <div className={styles['result-item']}>
              <div className={styles['result-content']}>
                <span className={styles['result-label']}>Cung hoàng đạo</span>
                <span className={styles['result-value']}>{zodiacSign}</span>
              </div>
              <ReadAloudButton text={zodiacSign} />
            </div>
            <div className={styles['result-item']}>
              <div className={styles['result-content']}>
                <span className={styles['result-label']}>Ý nghĩa ngày sinh</span>
                <span className={styles['result-value']}>{dayMeaning}</span>
              </div>
              <ReadAloudButton text={dayMeaning} />
            </div>
            <div className={styles['result-item']}>
              <div className={styles['result-content']}>
                <span className={styles['result-label']}>Ý nghĩa tháng sinh</span>
                <span className={styles['result-value']}>{monthMeaning}</span>
              </div>
              <ReadAloudButton text={monthMeaning} />
            </div>
            <div className={styles['result-item']}>
              <div className={styles['result-content']}>
                <span className={styles['result-label']}>Ý nghĩa năm sinh</span>
                <span className={styles['result-value']}>{yearMeaning}</span>
              </div>
              <ReadAloudButton text={yearMeaning} />
            </div>
            <div className={styles['result-item']}>
              <div className={styles['result-content']}>
                <span className={styles['result-label']}>Số chủ đạo</span>
                <span className={styles['result-value']}>{soChuDao}</span>
              </div>
              <ReadAloudButton text={soChuDao} />
            </div>
          </div>
        </div>
      )}
      <Analytics />
    </div>
  );
}

export default BoiNgaySinh;