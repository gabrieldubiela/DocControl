const puppeteer = require('puppeteer');
const supabase = require('../config/supabase');

const pdfService = {
  async generatePdf(templateHtml, contentHtml) {
    try {
      // Combinar template e conteúdo
      const finalHtml = templateHtml.replace('{{CONTEUDO}}', contentHtml);
      
      // Iniciar o navegador
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      // Criar uma nova página
      const page = await browser.newPage();
      
      // Definir o conteúdo HTML
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
      
      // Gerar o PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '1cm',
          right: '1cm',
          bottom: '1cm',
          left: '1cm'
        }
      });
      
      // Fechar o navegador
      await browser.close();
      
      // Fazer upload do PDF para o Supabase Storage
      const fileName = `documentos/${Date.now()}.pdf`;
      const { data, error } = await supabase.storage
        .from('documentos')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf'
        });
      
      if (error) {
        throw new Error(`Erro ao fazer upload do PDF: ${error.message}`);
      }
      
      // Obter a URL pública do arquivo
      const { publicURL, error: urlError } = supabase.storage
        .from('documentos')
        .getPublicUrl(fileName);
      
      if (urlError) {
        throw new Error(`Erro ao obter URL pública: ${urlError.message}`);
      }
      
      return publicURL;
    } catch (error) {
      throw new Error(`Erro ao gerar PDF: ${error.message}`);
    }
  }
};

module.exports = pdfService;