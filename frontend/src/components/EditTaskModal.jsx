import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTaskSchema } from '../schemas/task.schema';
import tasksService from '../services/tasks.service';

export function EditTaskModal({ task, onTaskUpdated, onClose }) {
  const [apiError, setApiError] = useState(null);

  // Inicialización de React Hook Form conectado con el esquema Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: { 
        title: task.title, 
        description: task.description || '', 
        completed: task.completed },
  });

  // enviar formulario y actualizar backend tras validar con Zod
  const onSubmit = async (data) => {
    try {
      setApiError(null);
      const updateTask = await tasksService.update(task.id, data);

      if (onTaskUpdated) {
        onTaskUpdated(updateTask);
      }

      if (onClose) {
        onClose();
      }

      reset();
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
      setApiError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl w-full max-w-lg space-y-4">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-slate-100">
            Editar Tarea
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 text-sm font-medium cursor-pointer transition"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Alerta de error si el servidor rechaza la petición */}
        {apiError && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Campo: Título de la tarea */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Título de la tarea <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Estudiar para el certamen"
              {...register('title')}
              className={`w-full bg-slate-900/90 border rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                errors.title
                  ? 'border-rose-500/80 focus:ring-rose-500/40'
                  : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
              }`}
            />
            {/* Mensaje de error de Zod en tiempo real */}
            {errors.title && (
              <p className="text-rose-400 text-xs mt-1.5">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Campo: Descripción opcional */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Descripción <span className="text-slate-500 text-xs">(opcional)</span>
            </label>
            <textarea
              rows="3"
              placeholder="Detalles adicionales..."
              {...register('description')}
              className={`w-full bg-slate-900/90 border rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition resize-none ${
                errors.description
                  ? 'border-rose-500/80 focus:ring-rose-500/40'
                  : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
              }`}
            />
            {errors.description && (
              <p className="text-rose-400 text-xs mt-1.5">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* campo: Estado Completado */}
          <div className="flex items-center space-x-3 pt-1">
            <input
              type="checkbox"
              id="completed-edit"
              {...register('completed')}
              className="w-4 h-4 bg-slate-900 border-slate-700 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-800 cursor-pointer"
            />
            <label htmlFor="completed-edit" className="text-sm font-medium text-slate-300 cursor-pointer">
              Marcar tarea como completada
            </label>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              {isSubmitting ? 'Guardando cambios...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
