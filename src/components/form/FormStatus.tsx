import { FormStatus as FormStatusType } from '@/types';

interface Props {
  status: FormStatusType;
  submissionId: string;
}

export default function FormStatus({ status, submissionId }: Props) {
  const getStatusContent = () => {
    switch (status) {
      case FormStatusType.SUBMITTED:
        return {
          title: 'Form Submitted',
          description: 'Your application has been submitted successfully.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: (
            <svg
              className="h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case FormStatusType.APPROVED:
        return {
          title: 'Application Approved',
          description: 'Congratulations! Your application has been approved.',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: (
            <svg
              className="h-6 w-6 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case FormStatusType.REJECTED:
        return {
          title: 'Application Rejected',
          description: 'We regret to inform you that your application has been rejected.',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: (
            <svg
              className="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      default:
        return {
          title: 'Form Status',
          description: 'Your application is being processed.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: (
            <svg
              className="h-6 w-6 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className={`p-4 ${statusContent.bgColor} rounded-md mb-6`}>
      <div className="flex">
        <div className="flex-shrink-0">{statusContent.icon}</div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${statusContent.color}`}>
            {statusContent.title}
          </h3>
          <div className="mt-2 text-sm text-gray-700">
            <p>{statusContent.description}</p>
            <p className="mt-1">
              Application ID: <span className="font-medium">{submissionId}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}