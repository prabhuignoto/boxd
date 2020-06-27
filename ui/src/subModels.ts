export interface SocketResponse {
  success: boolean;
  name: string;
  fileName?: string;
  uiJobId?: string;
  job_type?: string;
  status?: string;
}

export interface SocketDataResponse {
  data: {
    [key: string]: SocketResponse;
  };
}

export interface Notification {
  type: string;
  notificationTitle?: string;
  id: string;
  message: string;
}

export interface Job {
  id?: string;
  reason?: string;
}
