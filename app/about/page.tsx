"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[rgba(248,248,248,1)]">
      {/* Breadcrumbs */}
      <div className="bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-4 py-6 pt-24 lg:pt-32">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>О компании</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">О компании</h1>
            <p className="text-slate-600 text-lg">Содержание страницы будет добавлено позже</p>
          </div>
        </div>
      </section>
    </div>
  )
}
