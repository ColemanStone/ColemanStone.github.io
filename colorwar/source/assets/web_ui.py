"""Small Pygame toolbar for browsers; avoids desktop GUI font resources."""
from types import SimpleNamespace
import pygame

UI_BUTTON_PRESSED = pygame.USEREVENT + 1

class UIManager:
    def __init__(self, size, theme_path=None):
        self.buttons = []
        self.font = pygame.font.Font(None, 24)
        self.pressed = None
    def process_events(self, event):
        if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            self.pressed = next((b for b in self.buttons if b.rect.collidepoint(event.pos)), None)
        elif event.type == pygame.MOUSEBUTTONUP and event.button == 1:
            if self.pressed is not None and self.pressed.rect.collidepoint(event.pos):
                pygame.event.post(pygame.event.Event(UI_BUTTON_PRESSED, ui_element=self.pressed))
            self.pressed = None
    def update(self, time_delta):
        pass
    def draw_ui(self, screen):
        for button in self.buttons:
            pygame.draw.rect(screen, '#485973' if button is self.pressed else '#2e3c52', button.rect, border_radius=5)
            text = self.font.render(button.text, True, 'white')
            screen.blit(text, text.get_rect(center=button.rect.center))

class UIButton:
    def __init__(self, rect, text, manager):
        self.rect = rect
        self.text = text
        manager.buttons.append(self)
    def set_text(self, text):
        self.text = text

elements = SimpleNamespace(UIButton=UIButton)
