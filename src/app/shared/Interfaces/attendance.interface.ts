export interface Attendance {
  id: number;
  entryTime: string;
  exitTime: string;
  createAt: string;
  user: {
    id: number;
    name: string;
    rg: string;
    type: string;
  };
}
