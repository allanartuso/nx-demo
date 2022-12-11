import { ActionCreator, MemoizedSelector } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { RequestState } from '../common/request-state.model';
import { ApiRequestState, LoadingState } from '../common/utils/action-handlers';

export interface FormState<T, E> extends ApiRequestState<E>, LoadingState {
  resource: T;
}

export interface FormSelectors<T, E> {
  getRequestState: MemoizedSelector<object, RequestState>;
  getLoadingState: MemoizedSelector<object, RequestState>;
  getErrors: MemoizedSelector<object, E>;
  getResource: MemoizedSelector<object, T>;
  isReady: MemoizedSelector<object, boolean>;
}

export interface FormActions<T, E> {
  load: ActionCreator<string, (props: { id: string }) => { id: string } & TypedAction<string>>;
  loadSuccess: ActionCreator<string, (props: { resource: T }) => { resource: T } & TypedAction<string>>;
  loadFailure: ActionCreator<string, (props: { errors: E }) => { errors: E } & TypedAction<string>>;

  save: ActionCreator<string, (props: { resource: T }) => { resource: T } & TypedAction<string>>;
  saveSuccess: ActionCreator<string, (props: { resource: T }) => { resource: T } & TypedAction<string>>;
  saveFailure: ActionCreator<string, (props: { errors: E }) => { errors: E } & TypedAction<string>>;

  delete: ActionCreator<string, (props: { id: string }) => { id: string } & TypedAction<string>>;
  deleteSuccess: ActionCreator<string, (props: { id: string }) => { id: string } & TypedAction<string>>;
  deleteFailure: ActionCreator<string, (props: { errors: E }) => { errors: E } & TypedAction<string>>;

  navigateToCreate: ActionCreator<string, () => TypedAction<string>>;
  create: ActionCreator<string, (props: { resource: T }) => { resource: T } & TypedAction<string>>;
  createSuccess: ActionCreator<string, (props: { resource: T }) => { resource: T } & TypedAction<string>>;
  createFailure: ActionCreator<string, (props: { errors: E }) => { errors: E } & TypedAction<string>>;

  reset: ActionCreator<string, () => TypedAction<string>>;

  copy: ActionCreator<string, () => TypedAction<string>>;
  copySelected: ActionCreator<string, (props: { id: string }) => { id: string } & TypedAction<string>>;
}

export interface NotificationService<E> {
  onErrors: (errors: E) => void;
  onDelete: (id: string) => void;
}
