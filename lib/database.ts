import type { User, Product, Order } from "./types"

// In-memory data storage
const users: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "superadmin",
    permissions: {
      homepage: true,
      products: true,
      contacts: true,
      users: true,
      orders: true,
    },
    created_at: new Date().toISOString(),
  },
]

const products: Product[] = [
  {
    id: "1",
    title: "Костюм рабочий летний",
    description: "Костюм рабочий летний из смесовой ткани, усиленные швы",
    image: "/placeholder.svg?height=400&width=400",
    type: "production",
    show_on_homepage: true,
    additional_images: [],
    features: [],
    technical_specs: [],
    applications: [],
    advantages: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Ботинки рабочие с МП",
    description: "Ботинки рабочие кожаные с металлическим подноском",
    image: "/placeholder.svg?height=400&width=400",
    type: "production",
    show_on_homepage: true,
    additional_images: [],
    features: [],
    technical_specs: [],
    applications: [],
    advantages: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Перчатки рабочие х/б с ПВХ",
    description: "Перчатки рабочие х/б с ПВХ покрытием",
    image: "/placeholder.svg?height=400&width=400",
    type: "production",
    show_on_homepage: true,
    additional_images: [],
    features: [],
    technical_specs: [],
    applications: [],
    advantages: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Каска защитная",
    description: "Каска защитная промышленная",
    image: "/placeholder.svg?height=400&width=400",
    type: "production",
    show_on_homepage: true,
    additional_images: [],
    features: [],
    technical_specs: [],
    applications: [],
    advantages: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Респиратор противопылевой",
    description: "Респиратор противопылевой FFP2",
    image: "/placeholder.svg?height=400&width=400",
    type: "production",
    show_on_homepage: true,
    additional_images: [],
    features: [],
    technical_specs: [],
    applications: [],
    advantages: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Очки защитные",
    description: "Очки защитные с прозрачными линзами",
    image: "/placeholder.svg?height=400&width=400",
    type: "production",
    show_on_homepage: true,
    additional_images: [],
    features: [],
    technical_specs: [],
    applications: [],
    advantages: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const orders: Order[] = []

const homepageData: any = {
  hero: {
    title: "Актауский производитель деталей трубопроводов",
    subtitle: "Профессиональное производство высококачественных деталей трубопроводов",
    badge: "Производство с 2010 года",
    backgroundImage: "/placeholder.svg?height=600&width=1200",
  },
  advantages: [
    {
      id: "cert",
      title: "Сертификат СТ KZ",
      description: "Подтверждение отечественного происхождения продукции",
      icon: "Award",
      color: "green",
    },
    {
      id: "gost",
      title: "Соответствие ГОСТ",
      description: "Вся продукция изготавливается строго по нормативным документам и АТК",
      icon: "FileText",
      color: "blue",
    },
    {
      id: "quality",
      title: "Качество и надежность",
      description: "Современное оборудование и контроль качества",
      icon: "Settings",
      color: "purple",
    },
    {
      id: "approach",
      title: "Индивидуальный подход",
      description: "Быстрая обработка заказов и поставки по РК и СНГ",
      icon: "Clock",
      color: "red",
    },
  ],
  about: {
    title: "О компании",
    text1:
      "ТОО «АПДТ» — производственное предприятие, специализирующееся на изготовлении элементов трубопроводов, соответствующих требованиям государственных стандартов и отраслевых технических условий.",
    text2:
      "Наша продукция широко применяется в нефтегазовой, химической, энергетической, строительной и других отраслях. Мы гарантируем надежность, точность исполнения и полное соответствие стандартам.",
    image: "/placeholder.svg?height=600&width=800",
  },
  certificates: [
    {
      id: "cert1",
      title: "Сертификат соответствия ГОСТ",
      description: "Сертификат соответствия продукции требованиям ГОСТ",
      image: "/placeholder.svg?height=400&width=300",
      documentUrl: "",
    },
    {
      id: "cert2",
      title: "Сертификат качества ISO",
      description: "Международный сертификат системы менеджмента качества",
      image: "/placeholder.svg?height=400&width=300",
      documentUrl: "",
    },
  ],
  cta: {
    title: "Готовы начать сотрудничество?",
    subtitle: "Свяжитесь с нами для получения консультации и расчета стоимости",
  },
}

let contactsData: any = {
  phone: "+7 (771) 116-57-59",
  email: "info@ria-safety.kz",
  address: "Республика Казахстан, 130000, Мангистауская область, г. Актау, 3Б микрорайон, здание 40",
  whatsappUrl: "https://wa.me/77711165759",
  workingHours: {
    weekdays: "9:00 - 18:00",
    saturday: "Выходной",
    sunday: "Выходной",
  },
}

// Утилиты для работы с пользователями
export const userService = {
  async getAll(): Promise<User[]> {
    return [...users]
  },

  async getByUsername(username: string): Promise<User | null> {
    return users.find((u) => u.username === username) || null
  },

  async create(user: Omit<User, "id" | "created_at" | "last_login">): Promise<User | null> {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }
    users.push(newUser)
    return newUser
  },

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return null

    users[index] = { ...users[index], ...updates }
    return users[index]
  },

  async delete(id: string): Promise<boolean> {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return false

    users.splice(index, 1)
    return true
  },

  async updateLastLogin(id: string): Promise<void> {
    const user = users.find((u) => u.id === id)
    if (user) {
      user.last_login = new Date().toISOString()
    }
  },
}

// Утилиты для работы с товарами
export const productService = {
  async getAll(): Promise<{ production: Product[]; supply: Product[] }> {
    return {
      production: products.filter((p) => p.type === "production"),
      supply: products.filter((p) => p.type === "supply"),
    }
  },

  async getById(id: string): Promise<Product | null> {
    return products.find((p) => p.id === id) || null
  },

  async create(product: Omit<Product, "created_at" | "updated_at">): Promise<Product | null> {
    const newProduct: Product = {
      ...product,
      additional_images: product.additional_images || [],
      features: product.features || [],
      technical_specs: product.technical_specs || [],
      applications: product.applications || [],
      advantages: product.advantages || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    products.push(newProduct)
    return newProduct
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return null

    products[index] = {
      ...products[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return products[index]
  },

  async delete(id: string): Promise<boolean> {
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return false

    products.splice(index, 1)
    return true
  },
}

// Утилиты для работы с данными главной страницы
export const homepageService = {
  async getAll(): Promise<any> {
    return { ...homepageData }
  },

  async updateSection(section: string, data: any): Promise<boolean> {
    homepageData[section] = data
    return true
  },
}

// Утилиты для работы с контактами
export const contactsService = {
  async get(): Promise<any> {
    return { ...contactsData }
  },

  async update(contacts: any): Promise<boolean> {
    contactsData = { ...contacts }
    return true
  },
}

// Утилиты для работы с заявками
export const ordersService = {
  async getAll(): Promise<Order[]> {
    return [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  async create(order: {
    productName: string
    productImage: string
    productType: "production" | "supply"
    quantity: string
    contact: string
    city: string
  }): Promise<Order | null> {
    const newOrder: Order = {
      id: Date.now().toString(),
      product_name: order.productName,
      product_image: order.productImage,
      product_type: order.productType,
      quantity: Number.parseInt(order.quantity),
      contact: order.contact,
      city: order.city,
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    orders.push(newOrder)
    return newOrder
  },

  async updateStatus(id: string, status: "new" | "processing" | "completed"): Promise<boolean> {
    const order = orders.find((o) => o.id === id)
    if (!order) return false

    order.status = status
    order.updated_at = new Date().toISOString()
    return true
  },

  async delete(id: string): Promise<boolean> {
    const index = orders.findIndex((o) => o.id === id)
    if (index === -1) return false

    orders.splice(index, 1)
    return true
  },
}

// Утилита для подписки на изменения (заглушка)
export const subscribeToChanges = (table: string, callback: (payload: any) => void) => {
  // Mock implementation - does nothing
  return {
    unsubscribe: () => {},
  }
}
