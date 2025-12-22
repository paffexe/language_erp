import { Update, Start, Ctx, Help } from 'nestjs-telegraf';
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
        await ctx.replyWithHTML(`✅ <b>Xush kelibsiz, Abdulaziz!</b>

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
}
