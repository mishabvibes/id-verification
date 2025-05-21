import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import SubmissionModel from '@/models/Submission';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { FormStatus, FormCategory } from '@/types';
import HallTicketModel from '@/models/HallTicket'; // Import HallTicketModel

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check admin authentication
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Get total number of submissions
    const totalSubmissions = await SubmissionModel.countDocuments();
    
    // Get category breakdown
    const categoryAggregation = await SubmissionModel.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    
    const categoryBreakdown = {
      ECC: 0,
      TCC: 0,
    };
    
    categoryAggregation.forEach((item) => {
      if (item._id === 'ECC') {
        categoryBreakdown.ECC = item.count;
      } else if (item._id === 'TCC') {
        categoryBreakdown.TCC = item.count;
      }
    });
    
    // Get status breakdown
    const statusAggregation = await SubmissionModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    
    const statusBreakdown = {
      draft: 0,
      submitted: 0,
      approved: 0,
      rejected: 0,
    };
    
    statusAggregation.forEach((item) => {
      if (Object.values(FormStatus).includes(item._id as FormStatus)) {
        statusBreakdown[item._id as keyof typeof statusBreakdown] = item.count;
      }
    });
    
    // Get recent submissions
    const recentSubmissions = await SubmissionModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    const formattedRecentSubmissions = recentSubmissions.map((submission) => ({
      _id: submission._id.toString(),
      uniqueId: submission.uniqueId,
      category: submission.category,
      name: submission.personalDetails.name,
      status: submission.status,
      createdAt: submission.createdAt,
    }));

    const hallTicketStats = await HallTicketModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);
      
      const hallTicketStatusBreakdown = {
        issued: 0,
        downloaded: 0,
        used: 0,
      };
      
      hallTicketStats.forEach((item) => {
        if (item._id && hallTicketStatusBreakdown.hasOwnProperty(item._id)) {
          hallTicketStatusBreakdown[item._id as keyof typeof hallTicketStatusBreakdown] = item.count;
        }
      });
      
      const totalHallTickets = await HallTicketModel.countDocuments();
      
      // Add these to the return JSON
      return NextResponse.json({
        totalSubmissions,
        categoryBreakdown,
        statusBreakdown,
        recentSubmissions: formattedRecentSubmissions,
        hallTickets: {
          total: totalHallTickets,
          statusBreakdown: hallTicketStatusBreakdown
        }
      });
    
    return NextResponse.json({
      totalSubmissions,
      categoryBreakdown,
      statusBreakdown,
      recentSubmissions: formattedRecentSubmissions,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}