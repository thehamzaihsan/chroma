'use client';

import { useState } from 'react';
import { Plus, FolderOpen, Trash2, Copy, MoreVertical } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';

export default function ProjectsPage() {
  const { palettes, projects, createProject, deleteProject, deletePalette, duplicatePalette, setCurrentPalette, addToast } = useStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    createProject(newProjectName, newProjectDesc);
    setNewProjectName('');
    setNewProjectDesc('');
    setIsCreateModalOpen(false);
    addToast('Project created!', 'success');
  };

  const getProjectPalettes = (projectId: string) => {
    return palettes.filter(p => p.projectId === projectId);
  };

  const unsavedPalettes = palettes.filter(p => !p.projectId);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading">Projects</h1>
            <p className="text-sm text-text-muted">Organize your palettes into collections</p>
          </div>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={18} />
            New Project
          </Button>
        </div>
      </header>

      <main className="p-6 space-y-8">
        <section>
          <h2 className="text-lg font-medium mb-4">Your Projects</h2>
          {projects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-bg-secondary border border-dashed border-border">
              <FolderOpen size={48} className="mx-auto text-text-muted mb-4" />
              <h3 className="font-medium mb-2">No projects yet</h3>
              <p className="text-sm text-text-muted mb-4">Create a project to organize your palettes</p>
              <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={18} />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => {
                const projectPalettes = getProjectPalettes(project.id);
                return (
                  <div
                    key={project.id}
                    className="p-6 rounded-2xl bg-bg-secondary border border-border hover:border-accent/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-accent/20">
                        <FolderOpen size={24} className="text-accent" />
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(menuOpen === project.id ? null : project.id);
                          }}
                          className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {menuOpen === project.id && (
                          <div className="absolute right-0 top-full mt-1 py-2 rounded-xl bg-bg-tertiary border border-border shadow-xl z-10 min-w-[140px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProject(project.id);
                                setMenuOpen(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-bg-elevated flex items-center gap-2 text-error"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="font-medium mb-1">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-text-muted mb-3">{project.description}</p>
                    )}
                    <p className="text-xs text-text-muted">{projectPalettes.length} palettes</p>
                    {projectPalettes.length > 0 && (
                      <div className="flex h-8 rounded-lg overflow-hidden mt-3">
                        {projectPalettes.slice(0, 5).map((p) => (
                          <div
                            key={p.id}
                            className="flex-1"
                            style={{ backgroundColor: p.colors[0]?.hex || '#333' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-medium mb-4">Unsaved Palettes</h2>
          {unsavedPalettes.length === 0 ? (
            <p className="text-text-muted">All your palettes are organized in projects.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {unsavedPalettes.map((palette) => (
                <div
                  key={palette.id}
                  className="rounded-2xl bg-bg-secondary border border-border overflow-hidden group"
                >
                  <div className="flex h-24">
                    {palette.colors.map((color) => (
                      <div
                        key={color.id}
                        className="flex-1"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-sm truncate">{palette.name}</h3>
                      <p className="text-xs text-text-muted">
                        {new Date(palette.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          duplicatePalette(palette.id);
                          addToast('Palette duplicated!', 'success');
                        }}
                        className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => {
                          deletePalette(palette.id);
                          addToast('Palette deleted!', 'success');
                        }}
                        className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors text-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Name</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="My Awesome Project"
              className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-border focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description (optional)</label>
            <textarea
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              placeholder="A brief description of this project"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-border focus:border-accent focus:outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateProject} className="flex-1" disabled={!newProjectName.trim()}>
              Create Project
            </Button>
          </div>
        </div>
      </Modal>

      {selectedProject && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedProject(null)}
          title={projects.find(p => p.id === selectedProject)?.name || 'Project'}
          size="xl"
        >
          <div className="space-y-4">
            {getProjectPalettes(selectedProject).length === 0 ? (
              <p className="text-center text-text-muted py-8">No palettes in this project yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {getProjectPalettes(selectedProject).map((palette) => (
                  <div
                    key={palette.id}
                    className="rounded-xl bg-bg-tertiary border border-border overflow-hidden cursor-pointer hover:border-accent transition-colors"
                    onClick={() => {
                      setCurrentPalette(palette);
                      setSelectedProject(null);
                      addToast('Palette loaded!', 'success');
                    }}
                  >
                    <div className="flex h-20">
                      {palette.colors.map((color) => (
                        <div
                          key={color.id}
                          className="flex-1"
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm">{palette.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
