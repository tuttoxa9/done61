import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "Какой доход я могу получать как курьер?",
    answer: "Доход курьера в ЮНИК составляет от 2000 до 5000 BYN в месяц в зависимости от количества отработанных часов и выбранного транспорта. При работе на автомобиле доход выше, чем при работе пешком или на велосипеде."
  },
  {
    question: "Нужен ли опыт работы курьером?",
    answer: "Нет, опыт работы курьером не требуется. Мы проводим полное обучение для всех новых сотрудников. Главное - желание работать и ответственность."
  },
  {
    question: "С какого возраста можно работать курьером?",
    answer: "Работать курьером в ЮНИК можно с 16 лет. Для несовершеннолетних требуется согласие родителей или опекунов."
  },
  {
    question: "Как часто происходят выплаты?",
    answer: "Выплаты происходят 3 раза в неделю. Это обеспечивает стабильный денежный поток для наших курьеров."
  },
  {
    question: "Предоставляется ли термокороб бесплатно?",
    answer: "Да, термокороб предоставляется бесплатно всем новым курьерам в нашем офисе. Это входит в стартовый комплект для работы."
  },
  {
    question: "Какой график работы?",
    answer: "График работы полностью свободный. Вы сами выбираете, когда и сколько часов работать. Можно работать как несколько часов в день, так и полный рабочий день."
  },
  {
    question: "На каком транспорте можно работать?",
    answer: "Можно работать пешком, на велосипеде, самокате, мопеде или автомобиле. Оплата отличается в зависимости от способа передвижения."
  },
  {
    question: "Как быстро можно начать работать?",
    answer: "После подачи заявки наш менеджер свяжется с вами в течение 15 минут. После прохождения собеседования и получения необходимого оборудования можно начинать работать в тот же день."
  }
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="py-12 md:py-16" itemScope itemType="https://schema.org/FAQPage">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <span className="inline-block px-4 py-2 mb-4 rounded-full bg-primary/10 text-sm text-primary font-medium">
            Часто задаваемые вопросы
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Ответы на <span className="gradient-text">популярные вопросы</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Всё, что нужно знать о работе курьером в ЮНИК
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="glass-card p-6 cursor-pointer transition-all duration-300 hover:shadow-lg"
                onClick={() => toggleItem(index)}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <div className="flex justify-between items-center">
                  <h3
                    className="text-lg md:text-xl font-bold text-left pr-4"
                    itemProp="name"
                  >
                    {item.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openItem === index ? (
                      <ChevronUp className="h-5 w-5 text-primary" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>

                {openItem === index && (
                  <div
                    className="mt-4 pt-4 border-t border-gray-200"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p
                      className="text-muted-foreground leading-relaxed"
                      itemProp="text"
                    >
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Не нашли ответ на свой вопрос?</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Свяжитесь с нами, и мы ответим на все ваши вопросы
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+375333513320"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Позвонить: +375 33 351-33-20
              </a>
              <a
                href="https://t.me/xtxa666"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Написать в Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
