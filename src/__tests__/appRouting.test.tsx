import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { VIEW_TO_PATH_MAP, getCRMViewFromPath } from '@/App'
import { NationriseSidebar } from '@/components/crm/layout/NationriseSidebar'

describe('App Routing & Navigation System', () => {
  it('maps CRM views to clean URL routes correctly', () => {
    expect(VIEW_TO_PATH_MAP['Dashboard']).toBe('/dashboard')
    expect(VIEW_TO_PATH_MAP['Task Manager']).toBe('/task-manager')
    expect(VIEW_TO_PATH_MAP['Appointments']).toBe('/appointments')
    expect(VIEW_TO_PATH_MAP['Clients']).toBe('/clients')
    expect(VIEW_TO_PATH_MAP['To-Do List']).toBe('/todo-list')
    expect(VIEW_TO_PATH_MAP['Matter']).toBe('/todo-list')
    expect(VIEW_TO_PATH_MAP['Case Managers']).toBe('/case-managers')
    expect(VIEW_TO_PATH_MAP['Retainers and Invoices']).toBe('/retainers-invoices')
    expect(VIEW_TO_PATH_MAP['Deadline Centre']).toBe('/deadline-centre')
    expect(VIEW_TO_PATH_MAP['Client Portal']).toBe('/client-portal')
    expect(VIEW_TO_PATH_MAP['Settings']).toBe('/settings')
  })

  it('resolves CRM view from URL pathname correctly', () => {
    expect(getCRMViewFromPath('/dashboard')).toBe('Dashboard')
    expect(getCRMViewFromPath('/task-manager')).toBe('Task Manager')
    expect(getCRMViewFromPath('/appointments')).toBe('Appointments')
    expect(getCRMViewFromPath('/clients')).toBe('Clients')
    expect(getCRMViewFromPath('/todo-list')).toBe('To-Do List')
    expect(getCRMViewFromPath('/matter/DEMO-01')).toBe('Matter')
    expect(getCRMViewFromPath('/settings')).toBe('Settings')
  })

  it('renders NationriseSidebar with correct active links', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <NationriseSidebar
          currentView="Dashboard"
          onViewChange={() => {}}
        />
      </MemoryRouter>
    )

    expect(screen.getByAltText('Nationrise Immigration Services')).toBeInTheDocument()
    expect(screen.getByText('PRACTICE WORKSPACE')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Task Manager')).toBeInTheDocument()
    expect(screen.getByText('Appointments')).toBeInTheDocument()
    expect(screen.getByText('Clients')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
