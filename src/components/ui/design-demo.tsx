import React from 'react';
import { cn } from '@/lib/utils';

interface DesignDemoProps {
  className?: string;
}

export function DesignDemo({ className }: DesignDemoProps) {
  return (
    <div className={cn('p-6 space-y-8', className)}>
      <h2 className="text-2xl font-bold">University Community Design System</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3">Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md bg-primary"></div>
              <span className="mt-2 text-sm">Primary</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md bg-secondary"></div>
              <span className="mt-2 text-sm">Secondary</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md bg-accent"></div>
              <span className="mt-2 text-sm">Accent</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md bg-destructive"></div>
              <span className="mt-2 text-sm">Destructive</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">University Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md" style={{ backgroundColor: 'hsl(var(--university-blue))' }}></div>
              <span className="mt-2 text-sm">University Blue</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md" style={{ backgroundColor: 'hsl(var(--university-blue-light))' }}></div>
              <span className="mt-2 text-sm">University Blue Light</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md" style={{ backgroundColor: 'hsl(var(--university-green))' }}></div>
              <span className="mt-2 text-sm">University Green</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md" style={{ backgroundColor: 'hsl(var(--university-orange))' }}></div>
              <span className="mt-2 text-sm">University Orange</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">Gradients</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md gradient-primary"></div>
              <span className="mt-2 text-sm">Primary Gradient</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md gradient-secondary"></div>
              <span className="mt-2 text-sm">Secondary Gradient</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md gradient-accent"></div>
              <span className="mt-2 text-sm">Accent Gradient</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md gradient-hero"></div>
              <span className="mt-2 text-sm">Hero Gradient</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">Shadows</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md bg-white shadow-soft"></div>
              <span className="mt-2 text-sm">Soft Shadow</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md bg-white shadow-medium"></div>
              <span className="mt-2 text-sm">Medium Shadow</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-md bg-white shadow-strong"></div>
              <span className="mt-2 text-sm">Strong Shadow</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}