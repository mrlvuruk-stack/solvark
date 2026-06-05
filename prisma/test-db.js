const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

const getClient = () => {
  const url = process.env.DATABASE_URL || "file:./dev.db";
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter });
};

const db = getClient();

async function main() {
  console.log('Testing Prisma database transactions...');
  
  // Create a lead
  const email = `test-${Date.now()}@solvark.com`;
  const lead = await db.lead.create({
    data: {
      name: 'Test User',
      email: email,
      phone: '1234567890',
      company_name: 'Test Corp',
      service_interest: 'Website Development',
      budget_range: '₹1 Lakh+',
      project_details: 'Test details for a super long message that exceeds 100 characters so that the priority score gets computed correctly with high intent.',
      source: 'Contact Form',
      priority_score: 5,
      lead_status: 'new'
    }
  });
  console.log('Created lead successfully:', lead);

  // Check the lead
  const foundLead = await db.lead.findFirst({
    where: { email: email }
  });
  console.log('Found lead in DB:', foundLead);

  // Create a contact message associated with the lead
  const message = await db.contactMessage.create({
    data: {
      lead_id: lead.id,
      message: 'Hello, this is a test contact message!'
    }
  });
  console.log('Created contact message successfully:', message);

  // Clean up
  await db.contactMessage.deleteMany({
    where: { lead_id: lead.id }
  });
  await db.lead.delete({
    where: { id: lead.id }
  });
  console.log('Cleaned up test data successfully.');
}

main()
  .catch(e => {
    console.error('Test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
