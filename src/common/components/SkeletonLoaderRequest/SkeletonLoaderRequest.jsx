import React from 'react'

export default function SkeletonLoaderRequest() {
  return (
    <div className="border shadow p-4 max-w-sm w-full mx-auto h-28 border-y border-solid border-gray-300">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-slate-400 h-10 w-10" />
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-slate-400 rounded" />
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-400 rounded col-span-2" />
              <div className="h-2 bg-slate-400 rounded col-span-1" />
            </div>
            <div className="h-2 bg-slate-400 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
