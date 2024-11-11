import { api } from 'boot/axios';

class ImageService {
  private readonly baseUrl: string;

  constructor () {
    this.baseUrl = import.meta.env.VITE_APP_SERVER_IP;
    console.log('baseUrl assets:', this.baseUrl);
  }

  getFullImageUrl (relativePath: string): string {
    if (!relativePath) {
      console.warn('O caminho relativo da imagem não foi fornecido.');
      return '';
    }
    console.log('relativePath:', relativePath);
    return `${this.baseUrl}${relativePath}`;
  }

  async getImageById (id: number): Promise<any> {
    try {
      const response = await api.get(`/imagens/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro desconhecido ao buscar imagem');
    }
  }
}

export default new ImageService();
