import prisma from 'lib/prisma'

const seed = async () => {
  await prisma.products.deleteMany()

  await prisma.products.createMany({
    data: [
      {
        name: '프린터 정기구독',
        detail: '300페이지를 제약 없이 프린트! (A4)',
        price: 6900,
      },
      {
        name: '아이스크림 정기구독',
        detail: '이스크림을 하루 2개, 월 30개! 원하는 대로 골라요~',
        price: 9900,
      },

      {
        name: '생수 정기구독',
        detail: '원한 생수를 언제든지, 한달에 30개까지!',
        price: 14900,
      },
      {
        name: '음료 정기구독',
        detail: '하는 음료수를 한달에 20개까지, 자유롭게 마셔요!',
        price: 19900,
      },
      {
        name: '과자 정기구독',
        detail: '30개까지 원하는 과자를 제약없이!',
        price: 27900,
      },
    ],
  })
}

seed()
