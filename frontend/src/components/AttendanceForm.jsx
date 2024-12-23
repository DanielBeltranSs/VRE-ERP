import React, { useState, useEffect } from 'react';
import attendanceService from '../services/attendance.service';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../public/styles.css';

const AttendanceForm = () => {
  const { user } = useAuth();
  const [rut, setRut] = useState('');
  const [lastAttendance, setLastAttendance] = useState({ checkIn: null, checkOut: null, photoUrl: null });
  const [isWaiting, setIsWaiting] = useState(false);
  const [overrideAdmin, setOverrideAdmin] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchRut, setSearchRut] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [workHours, setWorkHours] = useState(null);
  const [workUserInfo, setWorkUserInfo] = useState({});
  const [absencesCount, setAbsencesCount] = useState(0);

  const formatDateTime = (dateTime) => {
    return dateTime ? format(new Date(dateTime), 'dd/MM/yyyy HH:mm:ss') : 'N/A';
  };

  useEffect(() => {
    if (user && user.rut) {
      setRut(user.rut);
      fetchLastAttendance(user.rut);
      setDefaultDates();
    }
  }, [user]);

  const setDefaultDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    setStartDate(firstDay);
    setEndDate(lastDay);
  };

  const fetchLastAttendance = async (rut) => {
    try {
      const response = await attendanceService.getLastAttendance(rut);
      setLastAttendance(response.attendance);
    } catch (error) {
      console.error('Error fetching last attendance:', error);
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const response = await attendanceService.getAttendanceRecords(searchRut, startDate, endDate);
      const recordsMap = new Map();

      response.records.forEach(record => {
        const date = format(new Date(record.checkIn), 'yyyy-MM-dd');
        recordsMap.set(date, {
          ...record,
          date: format(new Date(record.checkIn), 'dd/MM/yyyy'),
          checkIn: format(new Date(record.checkIn), 'HH:mm:ss'),
          checkOut: record.checkOut ? format(new Date(record.checkOut), 'HH:mm:ss') : null,
        });
      });

      const start = new Date(startDate);
      const end = new Date(endDate);
      const allDates = [];
      const inasistencias = [];

      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        if (recordsMap.has(formattedDate)) {
          allDates.push(recordsMap.get(formattedDate));
        } else {
          inasistencias.push(format(date, 'dd/MM/yyyy'));
          allDates.push({
            date: format(date, 'dd/MM/yyyy'),
            checkIn: 'Inasistencia',
            checkOut: 'Inasistencia',
          });
        }
      }

      setAttendanceRecords(allDates);
      setAbsencesCount(inasistencias.length);
      toast.success('Registros de asistencia actualizados');
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast.error('Error fetching attendance records.');
    }
  };

  const fetchWorkHours = async () => {
    try {
      await fetchAttendanceRecords();
      const totalHours = attendanceRecords.reduce((total, record) => {
        if (record.checkIn !== 'Inasistencia') {
          const checkIn = new Date(record.checkIn);
          const checkOut = new Date(record.checkOut || checkIn);
          const hours = (checkOut - checkIn) / 1000 / 3600;
          return total + hours;
        }
        return total;
      }, 0);
      setWorkHours(totalHours.toFixed(2));
      setWorkUserInfo(user);
    } catch (error) {
      console.error('Error calculating work hours:', error);
      toast.error('Error calculating work hours.');
    }
  };

  const handleCheckIn = async () => {
    setIsWaiting(true);
    try {
      const response = await attendanceService.checkIn(rut, overrideAdmin);
      setLastAttendance(response.attendance);
      toast.success('Check-in registered successfully');
    } catch (error) {
      console.error('Error registering check-in:', error);
      toast.error('Error registering check-in.');
    } finally {
      setIsWaiting(false);
    }
  };

  const handleCheckOut = async () => {
    setIsWaiting(true);
    try {
      const response = await attendanceService.checkOut(rut, overrideAdmin);
      setLastAttendance(response.attendance);
      toast.success('Check-out registered successfully');
    } catch (error) {
      console.error('Error registering check-out:', error);
      toast.error('Error registering check-out.');
    } finally {
      setIsWaiting(false);
    }
  };

  const getPhotoUrl = (url) => {
    return url.startsWith('http') ? url : `${import.meta.env.VITE_BASE_URL}${url}`;
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const { rut, username, email, photoUrl } = workUserInfo;

      doc.addImage(getPhotoUrl(photoUrl), 'JPEG', 10, 10, 30, 30);
      doc.setFontSize(12);
      doc.text(`RUT: ${rut}`, 10, 50);
      doc.text(`Name: ${username}`, 10, 60);
      doc.text(`Email: ${email}`, 10, 70);
      doc.text(`Worked Hours: ${workHours} hours`, 10, 80);
      doc.text(`Days Absent: ${absencesCount} days`, 10, 90);

      doc.setFontSize(14);
      doc.text('Attendance Records:', 10, 110);

      const tableColumn = ['Date', 'Check-in', 'Check-out'];
      const tableRows = [];

      attendanceRecords.forEach(record => {
        tableRows.push([record.date, record.checkIn, record.checkOut]);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 120,
        theme: 'grid',
      });

      doc.save('attendance_report.pdf');
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      toast.error('Error generating PDF report.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 md:px-12 lg:px-24">
      {/* Registrar asistencia section */}
      <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10 flex flex-col h-full">
        <table className="w-full table-fixed flex-grow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Registrar Asistencia</th>
            </tr>
          </thead>
          <tbody className="bg-white flex-grow">
            <tr>
              <td className="py-4 px-6 border-b border-gray-200 h-full">
                <div className="w-full">
                  <label className="block mb-2 text-black">RUT del Empleado:</label>
                  <input
                    type="text"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    required
                    className="p-2 mb-4 text-black border border-gray-300 rounded w-full bg-white"
                  />
                </div>
                {user.roles.some(role => role.name === 'admin') && (
                  <div className="mb-4 flex items-center justify-center">
                    <label className="mr-2 text-black">Registro manual:</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={overrideAdmin}
                        onChange={() => setOverrideAdmin(!overrideAdmin)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                )}
                <div className="mb-4 flex flex-col sm:flex-row justify-center items-center w-full space-y-2 sm:space-y-0 sm:space-x-2">
                  <button onClick={handleCheckIn} className="custom-button bg-blue-500 text-white px-4 py-2 flex-grow min-w-[80px]">Registrar Entrada</button>
                  <button onClick={handleCheckOut} className="custom-button bg-red-500 text-white px-4 py-2 flex-grow min-w-[80px]">Registrar Salida</button>
                </div>
                {isWaiting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 rounded">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-t-4 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-white">Por favor, ingrese su huella digital...</p>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Último registro section */}
      <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10 flex flex-col h-full">
        <table className="w-full table-fixed flex-grow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Último Registro</th>
            </tr>
          </thead>
          <tbody className="bg-white flex-grow">
            <tr>
              <td className="py-4 px-6 border-b border-gray-200 h-full">
                <div className="bg-white p-4 rounded shadow-md text-gray-700 text-center w-full h-full flex flex-col justify-center">
                  {lastAttendance.photoUrl && (
                    <div className="mb-4">
                      <img src={getPhotoUrl(lastAttendance.photoUrl)} alt="Foto del usuario" className="w-16 h-16 sm:w-12 sm:h-12 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full mx-auto" />
                    </div>
                  )}
                  <p><strong>RUT:</strong> {rut}</p>
                  <p><strong>Check-in:</strong> {formatDateTime(lastAttendance.checkIn)}</p>
                  <p><strong>Check-out:</strong> {formatDateTime(lastAttendance.checkOut)}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {user.roles.some(role => role.name === 'admin') && (
        <>
          {/* Registros de asistencia section */}
          <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Registros de Asistencia</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <div className="w-full mb-4">
                      <label className="block mb-2 text-black">Buscar por RUT:</label>
                      <input
                        type="text"
                        value={searchRut}
                        onChange={(e) => setSearchRut(e.target.value)}
                        className="p-2 mb-4 text-black border border-gray-300 rounded w-full bg-white"
                      />
                    </div>
                    <div className="w-full mb-4">
                      <label className="block mb-2 text-black">Fecha de Inicio:</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 mb-4 text-black border border-gray-300 rounded w-full bg-white"
                      />
                    </div>
                    <div className="w-full mb-4">
                      <label className="block mb-2 text-black">Fecha de Fin:</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 mb-4 text-black border border-gray-300 rounded w-full bg-white"
                      />
                    </div>
                    <div className="flex justify-center w-full">
                      <button onClick={fetchAttendanceRecords} className="custom-button bg-green-500 text-white px-4 py-2 mb-4 mr-2">Buscar Registros</button>
                      <button onClick={fetchWorkHours} className="custom-button bg-blue-500 text-white px-4 py-2 mb-4">Horas Trabajadas</button>
                    </div>
                    <div className="overflow-x-auto rounded w-full overflow-y-auto h-64">
                      {attendanceRecords.length > 0 ? (
                        <table className="min-w-full bg-white border border-gray-300 ">
                          <thead>
                            <tr>
                              <th className="py-2 text-black bg-gray-300 border border-gray-300">Fecha</th>
                              <th className="py-2 text-black bg-gray-300 border border-gray-300">Check-in</th>
                              <th className="py-2 text-black bg-gray-300 border border-gray-300">Check-out</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendanceRecords.map((record) => (
                              <tr key={record._id}>
                                <td className="py-2 text-black bg-gray-100 text-center">{record.date}</td>
                                <td className="py-2 text-black bg-gray-100 text-center">{record.checkIn}</td>
                                <td className="py-2 text-black bg-gray-100 text-center">{record.checkOut}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-black">No se encontraron registros</p>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Horas trabajadas section */}
          <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10 h-full flex flex-col">
            <table className="w-full table-fixed flex-grow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Horas Trabajadas</th>
                </tr>
              </thead>
              <tbody className="bg-white flex-grow">
                <tr>
                  <td className="py-4 px-6 border-b border-gray-200 h-full">
                    <div className="bg-white p-4 rounded shadow-md text-gray-700 text-center w-full h-full flex flex-col justify-center">
                      {workUserInfo && workUserInfo.photoUrl && (
                        <div className="mb-4">
                          <img src={getPhotoUrl(workUserInfo.photoUrl)} alt="Foto del usuario" className="w-16 h-16 sm:w-12 sm:h-12 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full mx-auto" />
                        </div>
                      )}
                      <p><strong>RUT:</strong> {workUserInfo.rut}</p>
                      <p><strong>Nombre:</strong> {workUserInfo.username}</p>
                      <p><strong>Email:</strong> {workUserInfo.email}</p>
                      <p><strong>Horas Trabajadas:</strong> {workHours ? `${workHours} horas` : 'N/A'}</p>
                      <div className="flex justify-center w-full mt-4">
                        <button onClick={generatePDF} className="custom-button bg-blue-500 text-white px-4 py-2">Generar Informe</button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceForm;
