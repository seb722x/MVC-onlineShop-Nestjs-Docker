import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  

  @Get('/')
  @Render('index')
  index() {
    
  }

  @Get('/about')
  @Render('about')
  about() {
    const viewData = [];
    viewData['title'] = 'About us - Store ';
    viewData['subtitle'] = 'About us';
    viewData['description'] = 'This is created with MVC pattern...';
    viewData['author'] = 'Developed by: Juan Sebastián';
    return {
      viewData: viewData,
    };
  }
}
