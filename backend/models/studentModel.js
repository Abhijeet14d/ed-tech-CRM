import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    cgpa: { type: Number, required: true },
    courseName: { type: String, required: true }
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;