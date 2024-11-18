import React from 'react';
import { Container, Typography, Box, Paper, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useHistory } from 'react-router-dom';

const TNCPage = () => {
  const history = useHistory();
  const handleClose = () => {
    history.push('/');
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          <b>Vapour Nepal Terms and Conditions</b>
          <IconButton onClick={handleClose} edge="end">
        <CloseIcon />
      </IconButton> 
        </Typography>
       
        <Divider sx={{ marginBottom: 3 }} />

        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Effective Date: 2081 BS
        </Typography>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body1">
            Welcome to VapourNepal, an online retailer of vaping products, e-liquids, and devices. By accessing or using our website
            (www.vapournepal.onrender.com) and services, you agree to comply with and be bound by the following terms and conditions. Please read
            them carefully before making any purchases or using our services.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            1. General Provisions
          </Typography>
          <Typography variant="body1">
            1.1 <strong>Acceptance of Terms</strong>: By using the VapourNepal website, you agree to these Terms and Conditions. If you do not agree to these terms, do not use the website or services.
          </Typography>
          <Typography variant="body1">
            1.2 <strong>Changes to Terms</strong>: VapourNepal reserves the right to modify or update these Terms and Conditions at any time. All changes will be effective upon posting to the website. We recommend that you review these terms regularly.
          </Typography>
          <Typography variant="body1">
            1.3 <strong>Eligibility</strong>: You must be at least 18 years old (or the legal age for purchasing vaping products in your jurisdiction) to use the services or make purchases through VapourNepal. By using our website, you confirm that you meet this age requirement.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            2. Products and Availability
          </Typography>
          <Typography variant="body1">
            2.1 <strong>Product Description</strong>: We make every effort to accurately describe our products on the website. However, we do not warrant that the descriptions, prices, or any other content is error-free or complete.
          </Typography>
          <Typography variant="body1">
            2.2 <strong>Product Availability</strong>: VapourNepal reserves the right to modify, discontinue, or limit the availability of any product at any time without notice.
          </Typography>
          <Typography variant="body1">
            2.3 <strong>Product Use Warning</strong>: Vaping products, including e-cigarettes, vape devices(Pods and Mods), coils and vape juices, should be used responsibly. VapourNepal does not endorse the use of vaping products by non-smokers or minors. Vaping may have health risks. Always consult with a healthcare professional before use, especially if you are pregnant, nursing, or have a medical condition.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            3. Age Verification
          </Typography>
          <Typography variant="body1">
            3.1 <strong>Age Verification Policy</strong>: We strictly follow Nepalese law in prohibiting the sale of vaping products to anyone under the age of 18. You must be able to provide proof of age upon request, including valid photo ID.
          </Typography>
          <Typography variant="body1">
            3.2 <strong>Vape Restrictions in Nepal</strong>: The sale, use, and advertisement of tobacco and nicotine products are restricted by law in Nepal. VapourNepal complies with the current laws and regulations regarding vaping products in Nepal. We are committed to ensuring that our products are sold legally, responsibly, and safely.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            4. User Registration and Account
          </Typography>
          <Typography variant="body1">
            4.1 <strong>Account Creation</strong>: To make a purchase on VapourNepal, you must create an account. You are responsible for maintaining the confidentiality of your account information, including your username and password.
          </Typography>
          <Typography variant="body1">
            4.2 <strong>Account Responsibility</strong>: You agree to accept responsibility for all activities that occur under your account, and you agree to notify VapourNepal immediately of any unauthorized use of your account.
          </Typography>
          <Typography variant="body1">
            4.3 <strong>Personal Information</strong>: By creating an account, you agree to provide accurate and complete information. We may use your information to process orders, send updates, or respond to customer service inquiries. Please review our Privacy Policy for more details on how we handle your personal data.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            5. Orders and Payments
          </Typography>
          <Typography variant="body1">
            5.1 <strong>Order Acceptance</strong>: VapourNepal reserves the right to refuse or cancel any order for any reason, including but not limited to product availability, pricing errors, or suspicion of fraudulent activity.
          </Typography>
          <Typography variant="body1">
            5.2 <strong>Pricing and Payment</strong>: All prices are listed in Nepalese Rupees (NPR). We accept various payment methods including digital wallets like eSewa, Khalti and bank transfers. Full payment is required before your order can be processed and shipped.
          </Typography>
          <Typography variant="body1">
            5.3 <strong>Taxes and Fees</strong>: Prices do not include taxes, duties, or shipping costs, which will be added to the final total at checkout. Customers are responsible for any import duties and taxes on different region of Nepal.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            6. Shipping and Delivery
          </Typography>
          <Typography variant="body1">
            6.1 <strong>Shipping Policy</strong>: VapourNepal ships products within Nepal. We strive to process and ship all orders within 1-3 business days, though delays may occur due to unforeseen circumstances.
          </Typography>
          <Typography variant="body1">
            6.2 <strong>Delivery Charges</strong>: Delivery charges are calculated based on the size and weight of the items in your order, and the delivery location. You will be notified of any shipping fees before completing your purchase.
          </Typography>
          <Typography variant="body1">
            6.3 <strong>Delivery Issues</strong>: VapourNepal is not responsible for any loss, theft, or damage that occurs during delivery. If your order does not arrive as expected, please contact us immediately so that we can help resolve the issue.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            7. Returns, Refunds, and Exchanges
          </Typography>
          <Typography variant="body1">
            7.1 <strong>Return Policy</strong>: Due to health and safety regulations, VapourNepal does not accept returns or exchanges on vaping products once they have been opened or used.
          </Typography>
          <Typography variant="body1">
            7.2 <strong>Damaged or Defective Products</strong>: If you receive a damaged or defective product, please contact us within 3 days of receiving your order. We will provide a full refund or replacement based on the issue.
          </Typography>
          <Typography variant="body1">
            7.3 <strong>Refunds</strong>: Refunds are issued according to our discretion. If a refund is approved, it will be processed back to the original payment method within 7-10 business days.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            8. Warranty
          </Typography>
          <Typography variant="body1">
            8.1 <strong>Manufacturer’s Warranty</strong>: Some products may come with a warranty offered by the manufacturer. Please check product descriptions for warranty details. VapourNepal does not offer warranties directly but will assist you in contacting the manufacturer for warranty-related issues.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            9. Limitation of Liability
          </Typography>
          <Typography variant="body1">
            9.1 <strong>Vape Use Risks</strong>: By purchasing from VapourNepal, you acknowledge that vaping products carry inherent risks, including but not limited to health risks and risks of injury. VapourNepal is not liable for any damages arising from the use or misuse of vaping products.
          </Typography>
          <Typography variant="body1">
            9.2 <strong>Limitation of Liability</strong>: VapourNepal will not be held liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services, even if we have been advised of the possibility of such damages.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            10. Governing Law and Dispute Resolution
          </Typography>
          <Typography variant="body1">
            10.1 <strong>Governing Law</strong>: These Terms and Conditions are governed by the laws of Nepal.
          </Typography>
          <Typography variant="body1">
            10.2 <strong>Dispute Resolution</strong>: Any disputes arising from these Terms will be resolved through arbitration, in accordance with the laws of Nepal.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            11. Contact Information
          </Typography>
          <Typography variant="body1">
            If you have any questions or concerns about these Terms and Conditions, please contact us at:
            <br />
            Email: vapournepal@gmail.com
            <br />
            Phone: +977 9848050240
            <br />
            Developer: Nikesh Dhakal
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TNCPage;
