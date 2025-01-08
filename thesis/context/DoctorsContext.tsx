"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Doctor } from '@prisma/client';
import { useAuth } from '@clerk/nextjs';

interface DoctorsContextType {
  doctors: Doctor[];
  isLoading: boolean;
  error: string | null;
  fetchDoctors: () => Promise<void>;
  addDoctor: (newDoctor: Partial<Doctor>) => Promise<Doctor>
  updateDoctor: (id: string, updatedDoctor: Partial<Doctor>) => Promise<Doctor>
  deleteDoctor: (id: string) => Promise<void>;
  getDoctorById: (id: string) => Promise<Doctor | null>;

}

const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined);

export const  useDoctors = () => {
  const context = useContext(DoctorsContext);
  if (!context) {
    throw new Error('useDoctors must be used within a DoctorsProvider');
  }
  return context;
};

export const DoctorsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const token = await getToken({ template: "TOKEN_Healthcare" });
      const response = await axios.get("http://localhost:3000/api/doctor", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-store"
        }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctorss in context:", error);
      setError("Failed to fetch doctors");
    } finally {
      setIsLoading(false);
    }
  };

  const addDoctor = async (newDoctor: Partial<Doctor>): Promise<Doctor> => {
    try {
      const token = await getToken({ template: "TOKEN_Healthcare" });
      const response = await axios.post("http://localhost:3000/api/doctor", newDoctor, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      const addedDoctor = response.data;
      setDoctors(prevDoctors => [...prevDoctors, addedDoctor]);
      return addedDoctor;
      } catch (error) {
      console.error("Error adding doctor:", error);
      throw error;
    }
  };

  const updateDoctor = async (id: string, updatedDoctor: Partial<Doctor>): Promise<Doctor> => {
    try {
      const token = await getToken({ template: "TOKEN_Healthcare" });
      const response = await axios.put(`http://localhost:3000/api/doctor/${id}`, updatedDoctor, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      const updatedDoctorData = response.data;
      setDoctors(prevDoctors => prevDoctors.map(doc => doc.id === id ? updatedDoctorData : doc));
      return updatedDoctorData;
    } catch (error) {
      console.error("Error updating doctor:", error);
      throw error;
    }
  };

  const deleteDoctor = async (id: string) => {
    try {
      const token = await getToken({ template: "TOKEN_Healthcare" });
      await axios.delete(`http://localhost:3000/api/doctor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(prevDoctors => prevDoctors.filter(doc => doc.id !== id));
    } catch (error) {
      console.error("Error deleting doctor:", error);
      throw error;
    }
  };
  const getDoctorById = async (id: string) => {
   
    try {
     
      const token = await getToken({ template: "TOKEN_Healthcare" });
      const response = await axios.get(`http://localhost:3000/api/doctor/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-store"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching doctor:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const value = {
    doctors,
    isLoading,
    error,
    fetchDoctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorById
  };

  return <DoctorsContext.Provider value={value}>{children}</DoctorsContext.Provider>;
};

