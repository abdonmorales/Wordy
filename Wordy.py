import os
import npyscreen

class WordProcessor(npyscreen.NPSAppManaged):
    def onStart(self):
        self.addForm('MAIN', MainForm, name="Wordy 1.0")
        self.addForm('SAVE', SaveForm, name="Save As...")
        self.addForm('LOAD', LoadForm, name="Load File...")
        self.addForm('HELP', HelpForm, name="Help and Documentation")

class MainForm(npyscreen.Form):
    def create(self):
        # Concise Instructions
        instruction_text = ("Navigate with arrows. Select with Enter. Exit sidebar with TAB + Enter on 'OK'.")
        self.instructions = self.add(npyscreen.TitleFixedText, name="Instructions:", value=instruction_text, editable=False, max_height=2)
        
        # Adjusted layout for text area and sidebar
        self.text_border = self.add(npyscreen.BoxBasic, name="Text Area", rely=3, relx=30, max_width=-30, max_height=-4)
        self.text = self.add(LineNumMultiLineEdit, name="Text:", value="Enter text here...", rely=4, relx=31, max_width=-31, max_height=-6)
        
        self.sidebar = self.add(npyscreen.BoxTitle, name="Options", rely=3, relx=2, max_width=28, max_height=-4)
        self.sidebar.values = ["Bold", "Underline", "Italics", "Title", "Heading", "Subtitle", "Save", "Load", "Help", "Quit"]
        self.sidebar.when_value_edited = self.sidebar_option_selected

    def sidebar_option_selected(self):
        selection = self.sidebar.value
        if selection in [0, 1, 2, 3, 4, 5]:  # Formatting options
            self.apply_formatting(selection)
        elif selection == 6:
            self.on_save_press()
        elif selection == 7:
            self.on_load_press()
        elif selection == 8:
            self.parentApp.switchForm('HELP')
        elif selection == 9:
            self.on_quit_press()

    def apply_formatting(self, selection):
        mapping = {
            0: ("*", "*"),  # Bold
            1: ("_", "_"),  # Underline
            2: ("/", "/"),  # Italics
            3: ("*** ", " ***"),  # Title
            4: ("** ", " **"),  # Heading
            5: ("* ", " *")  # Subtitle
        }
        start_char, end_char = mapping[selection]
        current_line = self.text.cursor_line
        self.text.values[current_line] = f"{start_char}{self.text.values[current_line]}{end_char}"
        self.text.display()

    def on_save_press(self):
        self.parentApp.switchForm('SAVE')
    
    def on_load_press(self):
        self.parentApp.switchForm('LOAD')

    def on_quit_press(self):
        self.parentApp.setNextForm(None)
        self.editing = False

class SaveForm(npyscreen.ActionForm):
    def create(self):
        self.filename = self.add(npyscreen.TitleFilename, name="Filename:")
    
    def on_ok(self):
        with open(self.filename.value, "w") as f:
            f.write(self.parentApp.getForm('MAIN').text.value)
        self.parentApp.switchFormPrevious()
    
    def on_cancel(self):
        self.parentApp.switchFormPrevious()

class LoadForm(npyscreen.ActionFormWithMenus):
    def create(self):
        self.file_list = self.add(npyscreen.MultiLineAction, name="Files:", values=self.list_files())
        self.file_list.actionHighlighted = self.load_file
    
    def list_files(self):
        return [f for f in os.listdir() if os.path.isfile(f)]
    
    def load_file(self, file_name, keypress):
        try:
            with open(file_name, 'r') as f:
                self.parentApp.getForm('MAIN').text.value = f.read()
        except Exception as e:
            npyscreen.notify_confirm(str(e), "Error")
        self.parentApp.switchFormPrevious()
    
    def on_cancel(self):
        self.parentApp.switchFormPrevious()

# Custom widget to display line numbers alongside text
class LineNumMultiLineEdit(npyscreen.MultiLineEdit):
    _contained_widgets = npyscreen.Textfield

    def display_value(self, vl):
        lines = vl.split("\n")
        max_num_len = len(str(len(lines)))
        numbered_lines = [f"{idx + 1:>{max_num_len}}: {line}" for idx, line in enumerate(lines)]
        return "\n".join(numbered_lines)

class HelpForm(npyscreen.ActionForm):
    def create(self):
        content = (
            "Wordy 1.0 Help and Documentation\n\n"
            "1. Navigate the sidebar using arrow keys.\n"
            "2. Press Enter to select an option.\n"
            "3. Apply formatting to the current line by selecting Bold, Underline, Italics, etc.\n"
            "4. Save and Load files using the respective options.\n"
            "5. Access this help documentation anytime by selecting the Help option.\n"
            "6. Quit the application using the Quit option.\n\n"
            "Formatting Symbols:\n"
            "*Bold*: Add asterisks around the text.\n"
            "_Underline_: Add underscores around the text.\n"
            "/Italics/: Add slashes around the text.\n"
            "*** Title ***: Denotes a title.\n"
            "** Heading **: Denotes a heading.\n"
            "* Subtitle *: Denotes a subtitle."
        )
        self.help_text = self.add(npyscreen.MultiLineEdit, value=content, editable=False, max_height=-2)
    
    def on_ok(self):
        self.parentApp.switchFormPrevious()

if __name__ == '__main__':
    app = WordProcessor()
    try:
        app.run()
    except npyscreen.wgwidget.NotEnoughSpaceForWidget:
        print("The terminal window is too small.")
        print("Resize to at least 80x30 and try again.")
