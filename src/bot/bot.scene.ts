import { Scene, SceneEnter, On, Ctx } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { BotService } from './bot.service';

interface SessionData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

interface BotContext extends Context {
  session: SessionData;
  scene: any;
}

@Scene('registration')
export class RegistrationScene {
  constructor(private readonly botService: BotService) {}

  @SceneEnter()
  async onEnter(@Ctx() ctx: BotContext) {
    await ctx.reply('Iltimos, ismingizni kiriting:');
  }

  @On('text')
  async onText(@Ctx() ctx: BotContext) {
    const text = (ctx.message as any).text;

    if (!ctx.session.firstName) {
      ctx.session.firstName = text;
      await ctx.reply('Familiyangizni kiriting:');
    } else if (!ctx.session.lastName) {
      ctx.session.lastName = text;
      await ctx.reply(
        'Telefon raqamingizni yuboring:',
        Markup.keyboard([
          Markup.button.contactRequest('📱 Telefon raqamni yuborish'),
        ]).resize(),
      );
    }
  }

  @On('contact')
  async onContact(@Ctx() ctx: BotContext) {
    const contact = (ctx.message as any).contact;

    if (contact.user_id != ctx.message?.from.id) {
      await ctx.reply(
        "❌ Iltimos, o'zingizning telefon raqamingizni yuboring.",
      );
      return;
    }

    ctx.session.phoneNumber = contact.phone_number;

    // Register student
    await this.botService.registerStudent({
      tgId: ctx.from?.id!,
      firstName: ctx.session.firstName!,
      lastName: ctx.session.lastName,
      tgUsername: ctx.from?.username!,
      phoneNumber: ctx.session.phoneNumber!,
    });

    await ctx.reply("✅ Ro'yxatdan o'tdingiz!", Markup.removeKeyboard());

    // Clear session and leave scene
    ctx.session = {};
    await ctx.scene.leave();
  }
}
