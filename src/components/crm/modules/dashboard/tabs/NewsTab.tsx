import React from 'react'
import { NewsArticle } from '@/types/crm'
import { toast } from '@/components/ui/sonner'

interface NewsTabProps {
  newsArticles: NewsArticle[]
  onSelectArticle: (article: NewsArticle) => void
}

export function NewsTab({ newsArticles, onSelectArticle }: NewsTabProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-[20px] font-bold text-[#1c2826]">Canada Immigration News</h2>

      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-2xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#1c2826]">Canada Immigration News</h3>
          <p className="text-xs text-[#6b7280] mt-1">
            Selected official IRCC updates · Checked October 8, 2026. This sample is a dated snapshot, not an automatic live feed.
          </p>
        </div>

        <div className="space-y-5 divide-y divide-[#f3f4f6]">
          {newsArticles.map((article) => (
            <div key={article.id} className="pt-3 first:pt-0">
              <div className="text-xs text-[#6b7280]">
                {article.date} · {article.source || 'IRCC'}
              </div>
              <button
                onClick={() => {
                  onSelectArticle(article)
                  toast.info('Opened IRCC bulletin')
                }}
                className="text-[15px] font-bold text-[#a75928] underline hover:text-[#924c1f] cursor-pointer mt-1 text-left block"
              >
                {article.title}
              </button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#f3f4f6] text-xs text-[#a75928] space-x-2 font-medium">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              toast.info('IRCC notices feed opened')
            }}
            className="underline hover:text-[#924c1f]"
          >
            See current IRCC notices
          </a>
          <span className="text-[#6b7280]">·</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              toast.info('IRCC newsroom feed opened')
            }}
            className="underline hover:text-[#924c1f]"
          >
            IRCC newsroom
          </a>
        </div>
      </div>
    </div>
  )
}
