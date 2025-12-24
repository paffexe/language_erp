import { Update, Start, Ctx, Help, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotService } from './bot.service';

interface BotContext extends Context {
  scene: any;
}

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async onStart(@Ctx() ctx: BotContext) {
    try {
      const student = await this.botService.getStudentByTgId(ctx.from?.id!);

      if (!student) {
        await ctx.scene.enter('registration');
      } else {
        await ctx.replyWithHTML(`✅ <b>Xush kelibsiz, ${ctx.from?.first_name}!</b>

📚 Siz allaqachon ro'yxatdan o'tgansiz.

🎓 Dashboard ochish uchun pastdagi <b>"HMHY"</b> tugmasini 
bosing yoki quyidagi buyruqlardan foydalaning:

/lessons - Mening darslarim
/lessons_history - Darslar tarixi
/help - Yordam`);
        return;
      }
    } catch (error) {
      console.log('Error in bot update', error);
    }
  }

  @Help()
  async onHelp(@Ctx() ctx: Context) {
    await ctx.replyWithHTML(
      `❓ <b>Yordam</b>

🎓 <b>Dashboard</b> - Pastdagi <b>"HMHY"</b> tugmasini bosing

📋 <b>Mavjud buyruqlar:</b>
/start - Botni qayta boshlash
/lessons - Mening darslarim
/lessons_history - Darslar tarixi
/help - Yordam

💡 <b>HMHY orqali:</b>
• Ustozlarni ko'rish va tanlash
• Dars vaqtlarini band qilish
• Darslaringizni boshqarish
• Profilingizni tahrirlash

📞 Muammo bo'lsa, admin bilan bog'laning.`,
    );
  }

  @Command('lessons')
  async onLessons(@Ctx() ctx: Context) {
    try {
      await ctx.reply('Sizning darslaringizni yuklayapman... ⏳');

      const lessons = await this.botService.getStudentLessons(ctx.from?.id!);

      if (!lessons.lessons.length) {
        await ctx.replyWithHTML("📚 Sizda hali darslar yo'q.");
        return;
      }

      const formatDateTime = (isoDate: Date) => {
        return new Date(isoDate).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      };

      const message = `📚 <b>Mening darslarim:</b>\n\n${lessons.lessons
        .map((item, index) => {
          return `${index + 1}. <b>Dars nomi: \t${item.name}</b>
📅 Boshlanish vaqti:\t ${formatDateTime(item.startTime)}
📅 Tugash vaqti:\t ${formatDateTime(item.endTime)}
🔗 Link: ${item.googleMeetsUrl}
───────────────`;
        })
        .join('\n\n')}`;

      await ctx.replyWithHTML(message);
    } catch (error) {
      console.log(error);
      await ctx.reply('❌ Xatolik yuz berdi.');
    }
  }

  @Command('lessons_history')
  async onLessonHistory(@Ctx() ctx: Context) {
    await ctx.reply('Sizning darslaringiz tarixini yuklayapman... ⏳');

    const lessons = await this.botService.getStudentHistoryLessons(
      ctx.from?.id!,
    );

    if (!lessons.lessons.length) {
      await ctx.replyWithHTML("📚 Sizda hali darslar tarixi yo'q.");
      return;
    }

    const formatDateTime = (isoDate: Date) => {
      return new Date(isoDate).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const message = `📚 <b>Mening darslarim tarixi:</b>\n\n${lessons.lessons
      .map((item, index) => {
        return `${index + 1}. <b>Dars nomi: \t${item.lesson.name}</b>
✅ Dars band qilingan sana :\t ${formatDateTime(item.lesson.bookedAt)}
📅 Boshlangan vaqti:\t ${formatDateTime(item.lesson.startTime)}
📅 Tugagan vaqti:\t ${formatDateTime(item.lesson.endTime)}
💰 Dars narxi:\t ${item.lesson.price}$
👤 Ustoz:\t ${item.teacher.fullName}
⭐ Darsga berilgan reyting:\t ${item.star}
📌 Darsga berilgan feedback:\t ${item.feedback}

───────────────`;
      })
      .join('\n\n')}`;

    await ctx.replyWithHTML(message);

    try {
    } catch (error) {
      console.log(error);
    }
  }
}
