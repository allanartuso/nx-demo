/* eslint-disable @typescript-eslint/ban-types */
import { FieldErrors, FormErrors, RequestState } from '@demo/shared/data-access';
import { ActionCreator, MemoizedSelector } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { ApiRequestState, LoadingState } from '../../utils/action-handlers';

export interface FormState<T> extends ApiRequestState, LoadingState {
  resource: T;
}

export interface FormSelectors<T> {
  getRequestState: MemoizedSelector<object, RequestState>;
  getLoadingState: MemoizedSelector<object, RequestState>;
  getFieldErrors: MemoizedSelector<object, FieldErrors>;
  getResource: MemoizedSelector<object, T>;
  isReady: MemoizedSelector<object, boolean>;
}

export interface FormActions<T> {
  load: ActionCreator<string, (props: { id: string }) => { id: string } & TypedAction<string>>;
  loadSuccess: ActionCreator<string, (props: { resource: T }) => { resource: T } & TypedAction<string>>;
  loadFailure: ActionCreator<string, (props: { error: FormErrors }) => { error: FormErrors } & TypedAction<string>>;

  save: ActionCreator<string, (props: { resource: T }) => { resource: T } & TypedAction<string>>;
  saveSuccess: ActionCreator<string, (props: { resource: T }) => { resource: T } & TypedAction<string>>;
  saveFailure: ActionCreator<string, (props: { error: FormErrors }) => { error: FormErrors } & TypedAction<string>>;

  delete: ActionCreator<string, (props: { id: string }) => { id: string } & TypedAction<string>>;
  deleteSuccess: ActionCreator<string, (props: { id: string }) => { id: string } & TypedAction<string>>;
  deleteFailure: ActionCreator<string, (props: { error: FormErrors }) => { error: FormErrors } & TypedAction<string>>;

  navigateToCreate: ActionCreator<string, () => TypedAction<string>>;
  create: ActionCreator<string, (props: { resource: T }) => { resource: T } & TypedAction<string>>;
  createSuccess: ActionCreator<string, (props: { resource: T }) => { resource: T } & TypedAction<string>>;
  createFailure: ActionCreator<string, (props: { error: FormErrors }) => { error: FormErrors } & TypedAction<string>>;

  reset: ActionCreator<string, () => TypedAction<string>>;

  copy: ActionCreator<string, () => TypedAction<string>>;
  copySelected: ActionCreator<string, (props: { id: string }) => { id: string } & TypedAction<string>>;
}
