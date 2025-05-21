import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import HallTicketModel from '@/models/HallTicket';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    
    const hallTicket = await HallTicketModel.findById(id);
    
    if (!hallTicket) {
      return NextResponse.json(
        { error: 'Hall ticket not found' }, 
        { status: 404 }
      );
    }
    
    // Generate HTML for printing
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hall Ticket - ${hallTicket.uniqueId}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }
          .hall-ticket {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 1px solid #ccc;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .header p {
            margin: 5px 0 0;
            color: #666;
          }
          .details {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
          }
          .info-group {
            margin-bottom: 15px;
          }
          .info-group div {
            margin-bottom: 10px;
          }
          .info-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 3px;
          }
          .info-value {
            font-weight: bold;
          }
          .photo-placeholder {
            border: 1px solid #ccc;
            height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f9f9f9;
          }
          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
          }
          .signature {
            text-align: center;
          }
          .signature-line {
            border-bottom: 1px dashed #000;
            height: 60px;
          }
          .signature-label {
            font-size: 12px;
            color: #666;
            margin-top: 8px;
          }
          .instructions {
            margin-top: 30px;
            border-top: 1px solid #ccc;
            padding-top: 15px;
          }
          .instructions h3 {
            margin-top: 0;
            margin-bottom: 10px;
          }
          .instructions ul {
            margin: 0;
            padding-left: 20px;
          }
          .instructions li {
            margin-bottom: 5px;
            font-size: 12px;
            color: #333;
          }
          @media print {
            body {
              padding: 0;
            }
            .hall-ticket {
              border: none;
            }
            .print-button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="hall-ticket">
          <div class="header">
            <h1>ENTRANCE EXAMINATION HALL TICKET</h1>
            <p>ANVARUL ISLAM ARABIC COLLAGE RAMAPURAM</p>
          </div>
          
          <div class="details">
            <div class="info-group">
              <div>
                <div class="info-label">ID Number</div>
                <div class="info-value">${hallTicket.uniqueId}</div>
              </div>
              
              <div>
                <div class="info-label">Program Code</div>
                <div class="info-value">${hallTicket.programCode}</div>
              </div>
              
              <div>
                <div class="info-label">Examination Centre</div>
                <div class="info-value">${hallTicket.centre}</div>
              </div>
              
              <div>
                <div class="info-label">Name</div>
                <div class="info-value">${hallTicket.name}</div>
              </div>
              
              <div>
                <div class="info-label">Date of Birth</div>
                <div class="info-value">${hallTicket.dateOfBirth}</div>
              </div>
              
              <div>
                <div class="info-label">Zone</div>
                <div class="info-value">${hallTicket.zone}</div>
              </div>
              
              <div>
                <div class="info-label">Membership ID</div>
                <div class="info-value">${hallTicket.membershipId}</div>
              </div>
            </div>
            
            <div class="photo-placeholder">
              <p>Candidate Photo</p>
            </div>
          </div>
          
          <div class="signatures">
            <div class="signature">
              <div class="signature-line"></div>
              <div class="signature-label">Signature of the Candidate</div>
            </div>
            
            <div class="signature">
              <div class="signature-line"></div>
              <div class="signature-label">Principal/Mudaris Signature</div>
            </div>
            
            <div class="signature">
              <div class="signature-line"></div>
              <div class="signature-label">SKSSF Unit Secretary Signature</div>
            </div>
          </div>
          
          <div class="instructions">
            <h3>Instructions:</h3>
            <ul>
              <li>Candidate must bring this hall ticket to the examination hall.</li>
              <li>Candidate should reach the examination centre at least 30 minutes before the exam.</li>
              <li>Mobile phones and other electronic devices are not allowed in the examination hall.</li>
              <li>Bring your own pen, pencil, and other stationery items.</li>
            </ul>
          </div>
        </div>
        
        <div class="print-button" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background-color: #4F46E5; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print Hall Ticket
          </button>
        </div>
        
        <script>
          // Auto-print when loaded
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;
    
    // Update hall ticket status to 'used' if it's 'downloaded'
    if (hallTicket.status === 'downloaded') {
      hallTicket.status = 'used';
      await hallTicket.save();
    }
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error generating printable hall ticket:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}