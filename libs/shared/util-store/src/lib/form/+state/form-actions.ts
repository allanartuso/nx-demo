import { FormErrors } from '@demo/shared/data-access';
import { createAction, props } from '@ngrx/store';
import { FormActions } from '../models/form.model';

export function createFormActions<T>(featureName: string): FormActions<T> {
  const load = createAction(`[${featureName} API] Load ${featureName}`, props<{ id: string }>());
  const loadSuccess = createAction(`[${featureName} API] Load ${featureName} Success`, props<{ resource: T }>());
  const loadFailure = createAction(`[${featureName} API] Load ${featureName} Failure`, props<{ error: FormErrors }>());

  const save = createAction(`[${featureName} API] Save ${featureName}`, props<{ resource: T }>());
  const saveSuccess = createAction(`[${featureName} API] Save ${featureName} Success`, props<{ resource: T }>());
  const saveFailure = createAction(`[${featureName} API] Save ${featureName} Failure`, props<{ error: FormErrors }>());

  const deleteAction = createAction(`[${featureName} API] Delete ${featureName}`, props<{ id: string }>());
  const deleteSuccess = createAction(`[${featureName} API] Delete ${featureName} Success`, props<{ id: string }>());
  const deleteFailure = createAction(
    `[${featureName} API] Delete ${featureName} Failure`,
    props<{ error: FormErrors }>()
  );

  const navigateToCreate = createAction(`[${featureName} Page] Navigate to Create ${featureName}`);
  const create = createAction(`[${featureName} API] Create ${featureName}`, props<{ resource: T }>());
  const createSuccess = createAction(`[${featureName} API] Create ${featureName} Success`, props<{ resource: T }>());
  const createFailure = createAction(
    `[${featureName} API] Create ${featureName} Failure`,
    props<{ error: FormErrors }>()
  );

  const reset = createAction(`[${featureName} API] Reset ${featureName}`);

  const copy = createAction(`[${featureName} Page] Copy ${featureName}`);
  const copySelected = createAction(`[${featureName} Page] Copy Selected ${featureName}`, props<{ id: string }>());

  return {
    load,
    loadSuccess,
    loadFailure,
    save,
    saveSuccess,
    saveFailure,
    delete: deleteAction,
    deleteSuccess,
    deleteFailure,
    navigateToCreate,
    create,
    createSuccess,
    createFailure,
    reset,
    copy,
    copySelected
  };
}
