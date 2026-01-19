import {
  PrismaClient,
  AdminRole,
  TeacherSpecialty,
  LessonStatus,
  TransactionStatus,
  TeacherLevel,
  Prisma,
} from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // Clear existing data (in reverse order of dependencies)
  await prisma.lessonHistory.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.teacherPayment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.lessonTemplate.deleteMany();
  await prisma.deletedTeacher.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.admin.deleteMany();

  console.log('Cleared existing data');

  // Seed Admins (19 regular admins only)
  const admins: Prisma.AdminCreateManyInput[] = [];
  const adminIds: string[] = [];
  for (let i = 1; i <= 19; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminId = randomUUID();
    adminIds.push(adminId);
    admins.push({
      id: adminId,
      username: `admin${i}`,
      password: hashedPassword,
      role: AdminRole.admin,
      phoneNumber: `+99890${String(1000000 + i).slice(1)}`,
      isActive: i <= 17,
      isDeleted: i > 17,
      deletedAt: i > 17 ? new Date() : null,
    });
  }
  await prisma.admin.createMany({ data: admins });
  console.log('Created 19 regular admins');

  // Seed Teachers (20)
  const teachers: Prisma.TeacherCreateManyInput[] = [];
  const teacherIds: string[] = [];
  const specialties = Object.values(TeacherSpecialty);
  const levels = Object.values(TeacherLevel);

  for (let i = 1; i <= 20; i++) {
    const hashedPassword = await bcrypt.hash('teacher123', 10);
    const teacherId = randomUUID();
    teacherIds.push(teacherId);
    teachers.push({
      id: teacherId,
      email: `teacher${i}@example.com`,
      phoneNumber: `+99891${String(1000000 + i).slice(1)}`,
      fullName: `Teacher ${i} Name`,
      password: hashedPassword,
      cardNumber: `8600${String(100000000000 + i).slice(1)}`,
      isActive: i <= 18,
      isDeleted: i > 18,
      deletedAt: i > 18 ? new Date() : null,
      specification: specialties[i % specialties.length],
      level: levels[i % levels.length],
      description: `Experienced ${specialties[i % specialties.length]} teacher with passion for teaching.`,
      hourPrice: 50000 + i * 10000,
      portfolioLink: `https://portfolio.example.com/teacher${i}`,
      imageUrl: `https://i.pravatar.cc/300?img=${i}`,
      googleId: `google-teacher-${i}`,
      googleRefreshToken: `refresh-token-${i}`,
      googleAccessToken: `access-token-${i}`,
      rating: Math.floor(Math.random() * 5) + 1,
      experience: `${Math.floor(Math.random() * 10) + 1} years`,
    });
  }
  await prisma.teacher.createMany({ data: teachers });
  console.log('Created 20 teachers');

  // Seed Deleted Teachers (20)
  const deletedTeachers: Prisma.DeletedTeacherCreateManyInput[] = [];
  for (let i = 1; i <= 20; i++) {
    deletedTeachers.push({
      id: randomUUID(),
      teacherId: teacherIds[(i - 1) % 20],
      deletedBy: adminIds[(i - 1) % 19],
      reason: `Violation of policy ${i}`,
      deletedAt: new Date(Date.now() - i * 86400000),
      restoreAt: i <= 10 ? new Date(Date.now() + i * 86400000) : null,
    });
  }
  await prisma.deletedTeacher.createMany({ data: deletedTeachers });
  console.log('Created 20 deleted teachers');

  // Seed Students (20)
  const students: Prisma.StudentCreateManyInput[] = [];
  const studentIds: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const studentId = randomUUID();
    studentIds.push(studentId);
    students.push({
      id: studentId,
      lastName: `LastName${i}`,
      firstName: `FirstName${i}`,
      phoneNumber: `+99893${String(1000000 + i).slice(1)}`,
      tgId: `tg-${100000 + i}`,
      tgUsername: i <= 15 ? `student${i}` : null,
      isActive: i <= 18,
      isBlocked: i > 15 && i <= 18,
      blockedAt: i > 15 && i <= 18 ? new Date() : null,
      blockedReason: i > 15 && i <= 18 ? 'Suspicious activity' : null,
      isDeleted: i > 18,
      deletedAt: i > 18 ? new Date() : null,
    });
  }
  await prisma.student.createMany({ data: students });
  console.log('Created 20 students');

  // Seed Lesson Templates (20)
  const lessonTemplates: Prisma.LessonTemplateCreateManyInput[] = [];
  const templateNames = [
    'Beginner Course',
    'Intermediate Course',
    'Advanced Course',
    'Conversation Practice',
    'Grammar Focus',
  ];

  for (let i = 1; i <= 20; i++) {
    lessonTemplates.push({
      id: randomUUID(),
      teacherId: teacherIds[(i - 1) % 20],
      name: `${templateNames[i % templateNames.length]} ${i}`,
      durationMinutes: [30, 45, 60, 90][i % 4],
      price: 50000 + i * 5000,
      description: `Comprehensive lesson focusing on ${templateNames[i % templateNames.length].toLowerCase()}`,
      isActive: i <= 18,
      isDeleted: i > 18,
      deletedAt: i > 18 ? new Date() : null,
    });
  }
  await prisma.lessonTemplate.createMany({ data: lessonTemplates });
  console.log('Created 20 lesson templates');

  // Seed Lessons (20)
  const lessons: Prisma.LessonCreateManyInput[] = [];
  const lessonIds: string[] = [];
  const statuses = Object.values(LessonStatus);

  // Iterate through all 20 teachers
  for (let tIndex = 0; tIndex < teacherIds.length; tIndex++) {
    const currentTeacherId = teacherIds[tIndex];

    // Create 20 lessons for the current teacher
    for (let i = 1; i <= 20; i++) {
      const startTime = new Date(Date.now() + i * 86400000); // 1 day increment
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration
      const status = statuses[i % statuses.length];

      const lessonId = randomUUID();
      lessonIds.push(lessonId); // Store ID for relations

      // Rotate students so not every teacher gets the same student for lesson 1
      const studentIndex = (tIndex + i) % studentIds.length;
      const currentStudentId = studentIds[studentIndex];

      lessons.push({
        id: lessonId,
        name: `Lesson ${i} - ${statuses[i % statuses.length]}`,
        startTime,
        endTime,
        teacherId: currentTeacherId,
        studentId: status !== LessonStatus.available ? currentStudentId : null,
        googleMeetsUrl: `https://meet.google.com/abc-defg-${String(tIndex * 20 + i).padStart(3, '0')}`,
        status,
        googleEventId: `event-${randomUUID()}`,
        price: 50000 + i * 5000,
        isPaid: status === LessonStatus.completed || i % 3 === 0,
        bookedAt:
          status !== LessonStatus.available
            ? new Date(Date.now() - i * 3600000)
            : null,
        // Link to a previous lesson by this specific teacher (if i > 10)
        remainedLessonId: i > 10 ? lessonIds[lessonIds.length - 11] : null,
        completedAt:
          status === LessonStatus.completed
            ? new Date(Date.now() - i * 1800000)
            : null,
        isDeleted: i > 18,
        deletedAt: i > 18 ? new Date() : null,
      });
    }
  }
  await prisma.lesson.createMany({ data: lessons });
  console.log(`Created ${lessons.length} lessons`);

  // Seed Teacher Payments (20)
  const teacherPayments: Prisma.TeacherPaymentCreateManyInput[] = [];
  for (let i = 1; i <= 20; i++) {
    const totalAmount = 50000 + i * 5000;
    const platformComission = 20;
    const platformAmount = Math.floor(totalAmount * (platformComission / 100));
    const teacherAmount = totalAmount - platformAmount;

    teacherPayments.push({
      id: randomUUID(),
      teacherId: teacherIds[(i - 1) % 20],
      lessonId: lessonIds[i - 1],
      totalLessonAmount: totalAmount,
      platformComission,
      platformAmount,
      teacherAmount,
      paidBy: adminIds[(i - 1) % 19],
      paidAt: new Date(Date.now() - i * 86400000),
      isCanceled: i > 18,
      canceledAt: i > 18 ? new Date() : null,
      canceledBy: i > 18 ? adminIds[(i - 1) % 19] : null,
      canceledReason: i > 18 ? 'Payment error' : null,
      notes: i % 2 === 0 ? `Payment note ${i}` : null,
      isDeleted: false,
      deletedAt: null,
    });
  }
  await prisma.teacherPayment.createMany({ data: teacherPayments });
  console.log('Created 20 teacher payments');

  // Seed Transactions (20)
  const transactions: Prisma.TransactionCreateManyInput[] = [];
  const transactionStatuses = Object.values(TransactionStatus);

  for (let i = 1; i <= 20; i++) {
    const status = transactionStatuses[i % transactionStatuses.length];

    transactions.push({
      id: randomUUID(),
      lessonId: lessonIds[(i - 1) % 20],
      studentId: studentIds[(i - 1) % 20],
      price: 50000 + i * 5000,
      status,
      canceledTime:
        status === TransactionStatus.cancelled
          ? new Date(Date.now() - i * 3600000)
          : null,
      performedTime:
        status === TransactionStatus.paid
          ? new Date(Date.now() - i * 7200000)
          : null,
      reason:
        status === TransactionStatus.cancelled
          ? `Cancellation reason ${i}`
          : null,
      isDeleted: i > 18,
      deletedAt: i > 18 ? new Date() : null,
    });
  }
  await prisma.transaction.createMany({ data: transactions });
  console.log('Created 20 transactions');

  // Seed Lesson Histories (20)
  const lessonHistories: Prisma.LessonHistoryCreateManyInput[] = [];
  for (let i = 1; i <= 20; i++) {
    lessonHistories.push({
      id: randomUUID(),
      lessonId: lessonIds[(i - 1) % 20],
      star: Math.floor(Math.random() * 5) + 1,
      feedback:
        i % 2 === 0
          ? `Great lesson! Very helpful and informative. Teacher ${i} was excellent.`
          : null,
      teacherId: teacherIds[(i - 1) % 20],
      studentId: studentIds[(i - 1) % 20],
      isDeleted: i > 18,
      deletedAt: i > 18 ? new Date() : null,
    });
  }
  await prisma.lessonHistory.createMany({ data: lessonHistories });
  console.log('Created 20 lesson histories');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
