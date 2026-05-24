import mongoose from 'mongoose';

const medicalRecordsSchema = new mongoose.Schema({}, { timestamps: true });

const MedicalRecord = mongoose.model ("MedicalRecord", medicalRecordsSchema);

export default MedicalRecord;