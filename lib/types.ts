export interface User {
  id: string
  username: string
  password: string
  role: "superadmin" | "admin"
  permissions: {
    homepage: boolean
    products: boolean
    contacts: boolean
    users?: boolean
    orders?: boolean
  }
  created_at: string
  last_login?: string
}

export interface Product {
  id: string
  title: string
  description: string
  image: string
  additional_images: string[]
  show_on_homepage: boolean
  features: string[]
  full_description: string
  technical_specs: { name: string; value: string }[]
  applications: string[]
  advantages: string[]
  show_features: boolean
  show_advantages: boolean
  show_applications: boolean
  show_download_button: boolean
  document_url: string
  type: "production" | "supply"
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  product_name: string
  product_image: string
  product_type: "production" | "supply"
  quantity: number
  contact: string
  city: string
  status: "new" | "processing" | "completed"
  created_at: string
  updated_at: string
}

export interface HomepageSection {
  id: string
  section: string
  data: any
  created_at: string
  updated_at: string
}

export interface ContactsData {
  id: string
  phone: string
  email: string
  address: string
  whatsapp_url: string
  working_hours: {
    weekdays: string
    saturday: string
    sunday: string
  }
  created_at: string
  updated_at: string
}
