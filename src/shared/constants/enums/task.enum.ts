export enum TaskSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum TaskStatus {
  PENDING = 'pending', // created, not yet accepted
  IN_PROGRESS = 'in_progress', // tasker started the work
  COMPLETED = 'completed', // successfully finished
  REJECTED = 'rejected', // tasker or system rejected
  CANCELLED = 'cancelled', // user cancelled
  OVERDUE = 'overdue', // time passed, not completed
}
