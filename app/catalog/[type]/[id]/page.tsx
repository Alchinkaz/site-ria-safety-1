"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, CheckCircle, ChevronLeft, ChevronRight, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import OrderForm from "@/components/order-form"
import { productService, contactsService } from "@/lib/database"
import Image from "next/image"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Добавить после импортов
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
)

export default function ProductPage({ params }: { params: { type: string; id: string } }) {
  const { type, id } = params
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showImageViewer, setShowImageViewer] = useState(false)
  const [orderForm, setOrderForm] = useState<{
    isOpen: boolean
    product: {
      id: string
      title: string
      description: string
      image?: string
      type: "production" | "supply"
    } | null
  }>({
    isOpen: false,
    product: null,
  })

  // Загружаем данные товара из Supabase
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true)
        const productData = await productService.getById(id)
        if (productData && productData.type === type) {
          setProduct(productData)
        }
      } catch (error) {
        console.error("Error loading product:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [type, id])

  // Функция для открытия WhatsApp
  const openWhatsApp = async () => {
    try {
      const contactsData = await contactsService.get()
      const whatsappUrl = contactsData?.whatsappUrl || "https://wa.me/77016579054"
      window.open(whatsappUrl, "_blank")
    } catch (error) {
      console.error("Error loading contacts:", error)
      window.open("https://wa.me/77016579054", "_blank")
    }
  }

  const openOrderForm = () => {
    if (product) {
      setOrderForm({
        isOpen: true,
        product: {
          id: product.id,
          title: product.title,
          description: product.description,
          image: product.image,
          type: type as "production" | "supply",
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка товара...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
          <Button variant="orange" asChild>
            <Link href="/catalog">Вернуться в каталог</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Получаем все изображения для галереи
  const allImages = [
    product.image,
    ...(product.additional_images || []).filter((img: string) => img && img.trim() !== ""),
  ]

  // Компонент просмотра изображений
  const ImageViewer = () => {
    if (!showImageViewer || allImages.length === 0) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center">
        <div className="relative max-w-4xl max-h-full p-4">
          <button
            onClick={() => setShowImageViewer(false)}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative">
            <Image
              src={allImages[selectedImageIndex] || "/placeholder.svg"}
              alt={`Изображение ${selectedImageIndex + 1}`}
              width={800}
              height={600}
              className="max-w-full max-h-[80vh] object-contain"
              quality={90}
              priority
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 hover:bg-gray-100"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === selectedImageIndex ? "bg-white" : "bg-white bg-opacity-50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-[#f8f8f8] pt-16">
        <div className="bg-white">
          <div className="w-full max-w-[1200px] mx-auto px-4 py-6 pt-20 lg:pt-16">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Главная</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/catalog">Каталог</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Product Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Галерея изображений */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Основное изображение */}
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div
                      className="aspect-square flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 cursor-pointer relative overflow-hidden"
                      onClick={() => {
                        setSelectedImageIndex(0)
                        setShowImageViewer(true)
                      }}
                    >
                      {product.image ? (
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                          priority
                          quality={85}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <span className="text-9xl">{product.icon}</span>
                      )}
                    </div>
                  </div>

                  {/* Дополнительные изображения */}
                  {product.additional_images && product.additional_images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.additional_images
                        .filter((img: string) => img && img.trim() !== "")
                        .map((image: string, index: number) => (
                          <div
                            key={index}
                            className="aspect-square bg-white rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative shadow-sm"
                            onClick={() => {
                              setSelectedImageIndex(index + 1)
                              setShowImageViewer(true)
                            }}
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`${product.title} - изображение ${index + 2}`}
                              fill
                              className="object-cover"
                              loading="lazy"
                              quality={75}
                              sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12vw, 8vw"
                            />
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Кнопки действий */}
                  <div className="space-y-3 pt-4">
                    <Button variant="orange" className="w-full" onClick={openOrderForm}>
                      Запросить цену
                    </Button>
                    {product.show_download_button && (
                      <Button
                        variant="outline"
                        className="w-full bg-white"
                        onClick={() => {
                          if (product.document_url) {
                            window.open(product.document_url)
                          } else {
                            alert("Документ временно недоступен")
                          }
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Скачать документацию
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Информация о товаре */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <Tabs defaultValue="description" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 mb-6">
                      <TabsTrigger value="description">Описание</TabsTrigger>
                      <TabsTrigger value="specifications">Характеристики</TabsTrigger>
                    </TabsList>

                    <h1 className="text-2xl font-bold mb-6 text-slate-900 md:text-2xl">{product.title}</h1>

                    <TabsContent value="description" className="space-y-6">
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: product.full_description || product.description }} />
                      </div>

                      {/* Особенности товара */}
                      {product.show_features && product.features && product.features.length > 0 && (
                        <div className="bg-slate-50 rounded-lg p-6 mt-8">
                          <h3 className="text-lg font-semibold mb-4">Особенности товара</h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {product.features.map((feature: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Преимущества */}
                      {product.show_advantages && product.advantages && product.advantages.length > 0 && (
                        <div className="bg-slate-50 rounded-lg p-6 mt-8">
                          <h3 className="text-lg font-semibold mb-4">Преимущества</h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {product.advantages.map((advantage: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <span>{advantage}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Области применения */}
                      {product.show_applications && product.applications && product.applications.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold mb-4">Области применения</h3>
                          <div className="grid sm:grid-cols-2 gap-6">
                            {product.applications.map((application: string, index: number) => (
                              <div
                                key={index}
                                className="bg-slate-50 rounded-lg p-4 flex items-center gap-3 hover:bg-slate-100 transition-colors"
                              >
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                                  <span className="text-lg">{index + 1}</span>
                                </div>
                                <span className="font-medium">{application}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
                        <div>
                          <h3 className="text-lg font-semibold text-red-900 mb-2">Нужна консультация?</h3>
                          <p className="text-red-800 mb-4">
                            Наши специалисты помогут подобрать оптимальное решение для вашей задачи и ответят на все
                            вопросы.
                          </p>
                          <Button
                            variant="outline"
                            className="bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700 hover:text-white"
                            onClick={openWhatsApp}
                          >
                            <WhatsAppIcon className="mr-2 h-4 w-4" />
                            Связаться
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="specifications" className="space-y-6">
                      {product.technical_specs && product.technical_specs.length > 0 ? (
                        <>
                          {/* Мобильная версия - карточки */}
                          <div className="block md:hidden space-y-4">
                            {product.technical_specs.map((spec: any, index: number) => (
                              <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <div className="font-medium text-slate-900 mb-1">{spec.name}</div>
                                <div className="text-slate-600">{spec.value}</div>
                              </div>
                            ))}
                          </div>

                          {/* Десктопная версия - таблица */}
                          <div className="hidden md:block overflow-hidden rounded-lg border border-slate-200">
                            <table className="min-w-full divide-y divide-slate-200">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                                  >
                                    Характеристика
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                                  >
                                    Значение
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-slate-200">
                                {product.technical_specs.map((spec: any, index: number) => (
                                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                      {spec.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{spec.value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <p>Технические характеристики будут добавлены позже</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <OrderForm
        isOpen={orderForm.isOpen}
        onClose={() => setOrderForm({ isOpen: false, product: null })}
        product={orderForm.product}
      />
      <ImageViewer />
    </>
  )
}
