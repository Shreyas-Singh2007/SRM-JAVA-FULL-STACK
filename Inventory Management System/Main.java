import java.util.Scanner;

public class Main {
    private static final Scanner scanner = new Scanner(System.in);
    private static final InventoryManager manager = new InventoryManager();

    // ANSI Color Codes
    public static final String RESET = "\u001B[0m";
    public static final String BOLD = "\u001B[1m";
    public static final String RED = "\u001B[31m";
    public static final String GREEN = "\u001B[32m";
    public static final String CYAN = "\u001B[36m";
    public static final String BLUE = "\u001B[34m";
    public static final String YELLOW = "\u001B[33m";

    public static void main(String[] args) {
        System.out.println(BLUE + "╭────────────────────────────────────────╮" + RESET);
        System.out.println(BLUE + "│" + BOLD + "       INVENTORY MANAGEMENT SYSTEM      " + RESET + BLUE + "│" + RESET);
        System.out.println(BLUE + "╰────────────────────────────────────────╯" + RESET);

        boolean running = true;

        while (running) {
            displayMainMenu();
            int choice = readInt(CYAN + " ❯ Enter your choice: " + RESET);
            switch (choice) {
                case 1:
                    productMenu();
                    break;
                case 2:
                    categoryMenu();
                    break;
                case 3:
                    stockMenu();
                    break;
                case 4:
                    manager.displayLowStock(5);
                    break;
                case 5:
                    System.out.println(GREEN + "\nThank you for using Inventory Management System." + RESET);
                    running = false;
                    break;
                default:
                    System.out.println(RED + "\n  ✗ Invalid choice. Please try again." + RESET);
            }
        }
        scanner.close();
    }

    private static void displayMainMenu() {
        System.out.println(BLUE + "\n╭────────────── MAIN MENU ───────────────╮" + RESET);
        System.out.println(BLUE + "│" + RESET + "  [ 1 ] Product Management              " + BLUE + "│" + RESET);
        System.out.println(BLUE + "│" + RESET + "  [ 2 ] Category Management             " + BLUE + "│" + RESET);
        System.out.println(BLUE + "│" + RESET + "  [ 3 ] Stock Management                " + BLUE + "│" + RESET);
        System.out.println(BLUE + "│" + RESET + "  [ 4 ] Low Stock Report                " + BLUE + "│" + RESET);
        System.out.println(BLUE + "│" + RESET + "  [ 5 ] Exit                            " + BLUE + "│" + RESET);
        System.out.println(BLUE + "╰────────────────────────────────────────╯" + RESET);
    }

    private static void productMenu() {
        boolean back = false;
        while (!back) {
            System.out.println(YELLOW + "\n╭───────── PRODUCT MANAGEMENT ───────────╮" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 1 ] Add Product                     " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 2 ] View Products                   " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 3 ] Search Product                  " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 4 ] Update Product                  " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 5 ] Delete Product                  " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 6 ] Back                            " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "╰────────────────────────────────────────╯" + RESET);

            int choice = readInt(CYAN + " ❯ Enter your choice: " + RESET);
            switch (choice) {
                case 1: addProduct(); break;
                case 2: manager.displayProducts(); break;
                case 3: searchProduct(); break;
                case 4: updateProduct(); break;
                case 5: deleteProduct(); break;
                case 6: back = true; break;
                default: System.out.println(RED + "  ✗ Invalid choice." + RESET);
            }
        }
    }

    private static void addProduct() {
        System.out.println(YELLOW + "\n  [ ADD PRODUCT ]" + RESET);
        int id = manager.getNextProductId();
        System.out.println("  Product ID: " + id);
        
        String name = readString("  Name     : ");
        String category = readString("  Category : ");
        double price = readDouble("  Price    : ");
        int stock = readInt("  Stock    : ");

        if (price < 0 || stock < 0) {
            System.out.println(RED + "  ✗ Price and stock cannot be negative." + RESET);
            return;
        }
        
        Product product = new Product(id, name, category, price, stock);
        if (manager.addProduct(product)) {
            System.out.println(GREEN + "  ✓ Product added successfully." + RESET);
        } else {
            System.out.println(RED + "  ✗ Unable to add product." + RESET);
        }
    }

    private static void searchProduct() {
        System.out.println(YELLOW + "\n  [ SEARCH PRODUCT ]" + RESET);
        String name = readString("  Search Name: ");
        manager.searchProduct(name);
    }

    private static void updateProduct() {
        System.out.println(YELLOW + "\n  [ UPDATE PRODUCT ]" + RESET);
        int id = readInt("  Product ID: ");
        Product product = manager.findProductById(id);
        
        if (product == null) {
            System.out.println(RED + "  ✗ Product not found." + RESET);
            return;
        }

        System.out.println(CYAN + "\n  Current Details: " + product + RESET);
        String name = readString("  New Name     : ");
        String category = readString("  New Category : ");
        double price = readDouble("  New Price    : ");

        if (price < 0) {
            System.out.println(RED + "  ✗ Price cannot be negative." + RESET);
            return;
        }

        if (manager.updateProduct(id, name, category, price)) {
            System.out.println(GREEN + "  ✓ Product updated successfully." + RESET);
        } else {
            System.out.println(RED + "  ✗ Unable to update product." + RESET);
        }
    }

    private static void deleteProduct() {
        System.out.println(YELLOW + "\n  [ DELETE PRODUCT ]" + RESET);
        int id = readInt("  Product ID: ");
        Product product = manager.findProductById(id);

        if (product == null) {
            System.out.println(RED + "  ✗ Product not found." + RESET);
            return;
        }

        System.out.println(CYAN + "  " + product + RESET);
        String confirmation = readString(RED + "  Are you sure you want to delete? (yes/no): " + RESET);

        if (confirmation.equalsIgnoreCase("yes")) {
            if (manager.deleteProduct(id)) {
                System.out.println(GREEN + "  ✓ Product deleted successfully." + RESET);
            } else {
                System.out.println(RED + "  ✗ Unable to delete product." + RESET);
            }
        } else {
            System.out.println("  Delete operation cancelled.");
        }
    }

    private static void categoryMenu() {
        boolean back = false;
        while (!back) {
            System.out.println(YELLOW + "\n╭───────── CATEGORY MANAGEMENT ──────────╮" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 1 ] Add Category                    " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 2 ] View Categories                 " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 3 ] Update Category                 " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 4 ] Delete Category                 " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 5 ] Back                            " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "╰────────────────────────────────────────╯" + RESET);

            int choice = readInt(CYAN + " ❯ Enter your choice: " + RESET);
            switch (choice) {
                case 1: addCategory(); break;
                case 2: manager.displayCategories(); break;
                case 3: updateCategory(); break;
                case 4: deleteCategory(); break;
                case 5: back = true; break;
                default: System.out.println(RED + "  ✗ Invalid choice." + RESET);
            }
        }
    }

    private static void addCategory() {
        System.out.println(YELLOW + "\n  [ ADD CATEGORY ]" + RESET);
        int id = manager.getNextCategoryId();
        System.out.println("  Category ID: " + id);

        String name = readString("  Category Name: ");
        Category category = new Category(id, name);

        if (manager.addCategory(category)) {
            System.out.println(GREEN + "  ✓ Category added successfully." + RESET);
        } else {
            System.out.println(RED + "  ✗ Category already exists." + RESET);
        }
    }

    private static void updateCategory() {
        System.out.println(YELLOW + "\n  [ UPDATE CATEGORY ]" + RESET);
        int id = readInt("  Category ID: ");
        Category category = manager.findCategoryById(id);

        if (category == null) {
            System.out.println(RED + "  ✗ Category not found." + RESET);
            return;
        }

        System.out.println(CYAN + "  Current category: " + category.getName() + RESET);
        String name = readString("  New Category Name: ");

        if (manager.updateCategory(id, name)) {
            System.out.println(GREEN + "  ✓ Category updated successfully." + RESET);
        } else {
            System.out.println(RED + "  ✗ Unable to update category." + RESET);
        }
    }

    private static void deleteCategory() {
        System.out.println(YELLOW + "\n  [ DELETE CATEGORY ]" + RESET);
        int id = readInt("  Category ID: ");
        Category category = manager.findCategoryById(id);

        if (category == null) {
            System.out.println(RED + "  ✗ Category not found." + RESET);
            return;
        }

        System.out.println(CYAN + "  " + category + RESET);
        String confirmation = readString(RED + "  Are you sure? (yes/no): " + RESET);

        if (!confirmation.equalsIgnoreCase("yes")) {
            System.out.println("  Delete operation cancelled.");
            return;
        }

        if (manager.deleteCategory(id)) {
            System.out.println(GREEN + "  ✓ Category deleted successfully." + RESET);
        } else {
            System.out.println(RED + "  ✗ Cannot delete category. It may be used by a product." + RESET);
        }
    }

    private static void stockMenu() {
        boolean back = false;
        while (!back) {
            System.out.println(YELLOW + "\n╭────────── STOCK MANAGEMENT ────────────╮" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 1 ] Add Stock                       " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 2 ] Remove Stock                    " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 3 ] View Products                   " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "│" + RESET + "  [ 4 ] Back                            " + YELLOW + "│" + RESET);
            System.out.println(YELLOW + "╰────────────────────────────────────────╯" + RESET);

            int choice = readInt(CYAN + " ❯ Enter your choice: " + RESET);
            switch (choice) {
                case 1: addStock(); break;
                case 2: removeStock(); break;
                case 3: manager.displayProducts(); break;
                case 4: back = true; break;
                default: System.out.println(RED + "  ✗ Invalid choice." + RESET);
            }
        }
    }

    private static void addStock() {
        System.out.println(YELLOW + "\n  [ ADD STOCK ]" + RESET);
        int id = readInt("  Product ID: ");
        Product product = manager.findProductById(id);

        if (product == null) {
            System.out.println(RED + "  ✗ Product not found." + RESET);
            return;
        }

        int quantity = readInt("  Quantity to add: ");
        if (manager.addStock(id, quantity)) {
            System.out.println(GREEN + "  ✓ Stock added successfully. New stock: " + product.getStock() + RESET);
        } else {
            System.out.println(RED + "  ✗ Invalid quantity." + RESET);
        }
    }

    private static void removeStock() {
        System.out.println(YELLOW + "\n  [ REMOVE STOCK ]" + RESET);
        int id = readInt("  Product ID: ");
        Product product = manager.findProductById(id);

        if (product == null) {
            System.out.println(RED + "  ✗ Product not found." + RESET);
            return;
        }

        System.out.println(CYAN + "  Current stock: " + product.getStock() + RESET);
        int quantity = readInt("  Quantity to remove: ");

        if (manager.removeStock(id, quantity)) {
            System.out.println(GREEN + "  ✓ Stock removed successfully. Remaining: " + product.getStock() + RESET);
        } else {
            System.out.println(RED + "  ✗ Unable to remove stock. Check available quantity." + RESET);
        }
    }

    private static int readInt(String message) {
        while (true) {
            try {
                System.out.print(message);
                return Integer.parseInt(scanner.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println(RED + "  ✗ Please enter a valid number." + RESET);
            }
        }
    }

    private static double readDouble(String message) {
        while (true) {
            try {
                System.out.print(message);
                return Double.parseDouble(scanner.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println(RED + "  ✗ Please enter a valid amount." + RESET);
            }
        }
    }

    private static String readString(String message) {
        while (true) {
            System.out.print(message);
            String value = scanner.nextLine().trim();
            if (!value.isEmpty()) {
                return value;
            }
            System.out.println(RED + "  ✗ Value cannot be empty." + RESET);
        }
    }
}